/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {Id64String} from "@bentley/bentleyjs-core";
import {ColorDef} from "@bentley/imodeljs-common";
import {IModelApp} from "@bentley/imodeljs-frontend";
import {ColorPickerButton} from "@bentley/ui-components";
import {Button, ButtonType, Icon, LabeledToggle, Spinner, SpinnerSize, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import {MachineLearningColorMode, MachineLearningLabel} from "../data/LabelTypes";
import '../styles/_LabelingWorkflowStyles.scss';
import {LabelTreeEntry, MLStateTableDataItem} from "../store/LabelingWorkflowTypes";
import VisibilityButtonAllComponent from "./VisibilityButtonAllComponent";
import VisibilityButtonComponent from "./VisibilityButtonComponent";
import {LabelButtonComponent} from "./LabelButtonComponent";
import {SelectionButtonComponent} from "./SelectionButtonComponent";


const FORCE_ALL = true;

interface MLStateTableComponentState {
    timerVar: any;
    filterEmptyRows: boolean;
}

interface ILabelSectionAttributes {
    allLabelVisible: boolean;
    allLabelHidden: boolean;
    allLabelTransparent: boolean;
    allLabelOpaque: boolean;
}

interface IPredictionSectionAttributes {
    allPredictionVisible: boolean;
    allPredictionHidden: boolean;
    allPredictionTransparent: boolean;
    allPredictionOpaque: boolean;
    anyPredictionSelected: boolean;
}

interface MLStateTableComponentProps {
    ready: boolean;
    itemMap: Map<MachineLearningLabel, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    canUndo: boolean;
    canRedo: boolean;
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelSelectionClick(itemId?: MachineLearningLabel): void;

    onLabelColorChange(newColor: ColorDef, name: MachineLearningLabel): void;

    onLabelExpandStateChange(newExpanded: boolean, name: MachineLearningLabel): void;

    onLabelApply(name: MachineLearningLabel): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionSelectionClick(itemId?: MachineLearningLabel): void;

    onSave(): void;

    onUndo(): void;

    onRedo(): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;
}


export class MLStateTableComponent extends React.Component<MLStateTableComponentProps, MLStateTableComponentState> {

    constructor(props: MLStateTableComponentProps) {
        super(props);

        this.state = {
            timerVar: undefined,
            filterEmptyRows: false,
        };
    }

    public render() {
        return <>
            {!this.props.ready && this.renderLoading()}
            {this.props.ready && this.renderTable()}
        </>;
    }

    private handleColorModeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (event.target !== undefined) {
            const colorMode = event.target.value as MachineLearningColorMode;
            this.props.onChangeColorMode(colorMode);
        }
    }

    private renderLoading = (): JSX.Element => <>
        <div className="sstc-spinner-container">
            <div className="sstc-spinner-inner-container">
                <Spinner size={SpinnerSize.XLarge}/>
            </div>
        </div>
    </>;

    private handleColorChange = (name: MachineLearningLabel) => (color: ColorDef) => {
        this.props.onLabelColorChange(color, name);
    }

    private renderClassNameAndColorSection(level: number, isExpanded: boolean, item: MLStateTableDataItem, i18nName: string): JSX.Element {
        const activeCaret = isExpanded ? "M1.4,3.3h13.3c0.5,0,0.8,0.6,0.5,1l-6.6,7.8c-0.3,0.3-0.7,0.3-1,0L0.9,4.3C0.6,3.9,0.8,3.3,1.4,3.3z"
            : "M3.5,14.6V1.3c0-0.5,0.6-0.8,1-0.5l7.8,6.6c0.3,0.3,0.3,0.7,0,1L4.5,15C4.2,15.4,3.5,15.1,3.5,14.6z";

        return <>
            <div className="mltc-level-spacer" style={{minWidth: 16 * level}}/>
            <Button
                className="mltc-expand-button"
                style={{minWidth: 26, maxWidth: 28}}
                onClick={() => {
                    this.props.onLabelExpandStateChange(!isExpanded, item.name);
                }}
            >
                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                    activeCaret
                ]}/>
            </Button>
            <div className="mltc-label-container">
                {i18nName}
            </div>
            <ColorPickerButton
                className="sstc-color-picker-button"
                initialColor={item.color}
                onColorPick={this.handleColorChange(item.name)}
            />
        </>
    }

    private renderLabelSection(item: MLStateTableDataItem, i18nName: string, trueDisplayedCount: number): JSX.Element {
        return <>
            <VisibilityButtonComponent
                transparencyAvailable={true}
                label={i18nName}
                itemId={item.name}
                visible={item.trueLabelIsDisplayed}
                transparent={item.trueLabelIsTransparent}
                onClick={this.props.onLabelDisplayChange}
            />
            <SelectionButtonComponent
                label={i18nName}
                itemId={item.name}
                hilite={item.trueLabelSelectedCount !== 0}
                onClick={this.props.onLabelSelectionClick}
            />
            <LabelButtonComponent
                label={i18nName}
                name={item.name}
                onClick={this.props.onLabelApply}
            />
            <div className="sstc-count-container">
                {trueDisplayedCount}
            </div>
        </>
    }

    private renderPredictionSection(item: MLStateTableDataItem, i18nName: string, predDisplayedCount: number): JSX.Element {
        return <>
            <VisibilityButtonComponent
                transparencyAvailable={true}
                label={i18nName}
                itemId={item.name}
                visible={item.predLabelIsDisplayed}
                transparent={item.predLabelIsTransparent}
                onClick={this.props.onPredictionDisplayChange}
            />
            <SelectionButtonComponent
                label={i18nName}
                itemId={item.name}
                hilite={item.predLabelSelectedCount !== 0}
                onClick={this.props.onPredictionSelectionClick}/>
            <div className="sstc-count-container">
                {predDisplayedCount}
            </div>
        </>
    }

    private renderTableHead(labelSectionAttributes: ILabelSectionAttributes, predSectionAttributes: IPredictionSectionAttributes): JSX.Element {
        let headerStyle = {
            backgroundColor: "#ddd",
            fontSize: "11px"
        }

        return <>
            <thead>
            <tr style={headerStyle}>
                <th className="mltc-name-th">Name</th>
                <th className="mltc-label-th">Label</th>
                <th className="mltc-prediction-th">Prediction</th>
            </tr>
            <tr>
                <td className="mltc-name-td">
                    <div className="mltc-label-container">
                        <LabeledToggle
                            className="sstc-hide-empty-toggle"
                            label="Hide Empty"
                            isOn={this.state.filterEmptyRows}
                            onChange={this.handleToggleFilter}
                        />
                    </div>
                    <Button
                        className="sstc-swap-button"
                        buttonType={ButtonType.Blue}
                        onClick={this.props.onSwapTruePredDisplay}
                    >
                        <Icon iconSpec="icon-replace"/>
                    </Button>
                </td>
                <td className="mltc-label-td">
                    <VisibilityButtonAllComponent
                        transparencyAvailable={true}
                        allHidden={labelSectionAttributes.allLabelHidden}
                        allVisible={labelSectionAttributes.allLabelVisible}
                        allTransparent={labelSectionAttributes.allLabelTransparent}
                        allOpaque={labelSectionAttributes.allLabelOpaque}
                        onClick={
                            (newVisible: boolean, newTransparent: boolean) => {
                                this.props.onLabelDisplayChange(newVisible, newTransparent, undefined);
                            }
                        }
                    />
                    <SelectionButtonComponent label={IModelApp.i18n.translate("LabelingApp.everything")}
                                              onClick={() => {
                                                    this.props.onLabelSelectionClick(undefined);
                                                }}/>
                </td>
                <td className="mltc-prediction-td">
                    <VisibilityButtonAllComponent
                        transparencyAvailable={true}
                        allHidden={predSectionAttributes.allPredictionHidden}
                        allVisible={predSectionAttributes.allPredictionVisible}
                        allTransparent={predSectionAttributes.allPredictionTransparent}
                        allOpaque={predSectionAttributes.allPredictionOpaque}
                        onClick={
                            (newVisible: boolean, newTransparent: boolean) => {
                                this.props.onPredictionDisplayChange(newVisible, newTransparent, undefined);
                            }
                        }
                    />
                    <SelectionButtonComponent label={IModelApp.i18n.translate("LabelingApp.everything")}
                                              onClick={() => {
                                                    this.props.onPredictionSelectionClick(undefined);
                                                }}/>
                </td>
            </tr>
            </thead>
        </>
    }

    private renderTable(): JSX.Element {
        const autoSaveEnabled = this.state.timerVar !== undefined;
        const onlyShowPresent = true;

        const tableRows: JSX.Element[] = [];
        let labelSectionAttributes: ILabelSectionAttributes = {
            allLabelVisible: true,
            allLabelHidden: true,
            allLabelTransparent: true,
            allLabelOpaque: true
        }

        let predSectionAttributes: IPredictionSectionAttributes = {
            allPredictionVisible: true,
            allPredictionHidden: true,
            allPredictionTransparent: true,
            allPredictionOpaque: true,
            anyPredictionSelected: false
        }

        let anyLabelSelected = false;

        for (const item of this.props.itemMap.values()) {
            if (!item.trueLabelIsDisplayed) {
                labelSectionAttributes.allLabelVisible = false;
            } else {
                labelSectionAttributes.allLabelHidden = false;
            }
            if (!item.trueLabelIsTransparent) {
                labelSectionAttributes.allLabelTransparent = false;
            } else {
                labelSectionAttributes.allLabelOpaque = false;
            }
            if (item.trueLabelSelectedCount !== 0) {
                anyLabelSelected = true;
            }
            if (!item.predLabelIsDisplayed) {
                predSectionAttributes.allPredictionVisible = false;
            } else {
                predSectionAttributes.allPredictionHidden = false;
            }
            if (!item.predLabelIsTransparent) {
                predSectionAttributes.allPredictionTransparent = false;
            } else {
                predSectionAttributes.allPredictionOpaque = false;
            }
            if (item.predLabelSelectedCount !== 0) {
                predSectionAttributes.anyPredictionSelected = true;
            }
        }

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean) => {

            if (!onlyShowPresent || FORCE_ALL || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);
                const trueDisplayedCount = anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = predSectionAttributes.anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;

                if (this.state.filterEmptyRows === false || trueDisplayedCount !== 0 || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td" style={{whiteSpace: "nowrap"}}>
                                {this.renderClassNameAndColorSection(level, isExpanded, item, i18nName)}
                            </td>
                            <td className="mltc-label-td" style={{whiteSpace: "nowrap"}}>
                                {this.renderLabelSection(item, i18nName, trueDisplayedCount)}
                            </td>
                            <td className="mltc-prediction-td" style={{whiteSpace: "nowrap"}}>
                                {this.renderPredictionSection(item, i18nName, predDisplayedCount)}
                            </td>
                        </tr>
                    );
                }
            }
        }

        const _recurse = (treeItem: LabelTreeEntry) => {
            const item = this.props.itemMap.get(treeItem.name);
            if (item === undefined) {
                return;
            }
            processItem(item, treeItem.level, treeItem.isExpanded);
            if (treeItem.isExpanded) {
                for (const child of treeItem.children) {
                    _recurse(child);
                }
            }
        }

        for (const entry of this.props.labelTree) {
            _recurse(entry);
        }

        const colorModeOptions: JSX.Element[] = [];
        for (const colorMode of this.props.availableColorModes) {
            const colorModeI18n = IModelApp.i18n.translate(colorMode);
            colorModeOptions.push(
                <option key={`color-mode-option-${colorMode}`} value={colorMode}>{colorModeI18n}</option>
            );
        }

        return <>
            <div className="sstc-data-container">
                <table className="sstc-data-table">
                    {this.renderTableHead(labelSectionAttributes, predSectionAttributes)}
                    <tbody>
                    {tableRows}
                    </tbody>
                </table>
            </div>
            <div className="sstc-color-mode-container">
                <label className="sstc-color-mode-label">
                    {IModelApp.i18n.translate("LabelingApp:colorMode")}
                    <select
                        className="sstc-color-mode-select"
                        value={this.props.currentColorMode}
                        onChange={this.handleColorModeChange}
                    >
                        {colorModeOptions}
                    </select>
                </label>
            </div>
            <div className="sstc-action-container">
                <Button className="sstc-control-button"
                        onClick={this.props.onSave}
                        disabled={!this.props.isDirty}><Icon
                    iconSpec="icon-save"/></Button>&nbsp;
                <div className="sstc-action-container-expand">
                    <LabeledToggle
                        label={`Auto Save (${1.0} min.)`}
                        isOn={autoSaveEnabled}
                        onChange={this.handleAutoSaveToggle}
                    />
                </div>
                <Button className="sstc-control-button"
                        onClick={this.props.onUndo}
                        disabled={!this.props.canUndo}>
                    <Icon iconSpec="icon-undo"/>
                </Button>&nbsp;
                <Button className="sstc-control-button"
                        onClick={this.props.onRedo}
                        disabled={!this.props.canRedo}>
                    <Icon iconSpec="icon-redo"/>
                </Button>&nbsp;
            </div>
        </>;
    }

    private handleToggleFilter = (enable: boolean) => {
        this.setState({filterEmptyRows: enable});
    }

    private handleAutoSaveToggle = (enable: boolean) => {
        if (enable) {
            if (this.state.timerVar !== undefined) {
                clearInterval(this.state.timerVar);
            }
            const timerVar = setInterval(this.props.onSave, 60000);
            this.setState({
                timerVar: timerVar,
            })
        } else {
            if (this.state.timerVar !== undefined) {
                clearInterval(this.state.timerVar);
            }
            this.setState({
                timerVar: undefined,
            })
        }
    }
}
