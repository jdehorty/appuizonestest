import {Id64String} from "@bentley/bentleyjs-core";
import {ColorDef} from "@bentley/imodeljs-common";
import {IModelApp} from "@bentley/imodeljs-frontend";
import {ColorPickerButton} from "@bentley/ui-components";
import {Button, Icon, Spinner, SpinnerSize, LabeledToggle, ButtonType, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import {MachineLearningColorMode, MachineLearningLabel} from "../../data/LabelTypes";
import "../../styles/LabelingWorkflowStylesV2.scss";
import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import AppearanceBatchToggleComponent from "../AppearanceBatchToggle";
import {GroupSelectButtonComponent} from "../GroupSelectButton";
import MLStateTablePopout from "../MLStateTablePopout";
import ConnectedLabelTableBody from "./LabelTableBody";
import ConnectedLabelTableFooter from "./LabelTableFooter";
import {ConnectedLabelTableHeader, ConnectedLabelTableHeaderPopout} from "./LabelTableHeader";
import {LabelerState} from "../../store/LabelerState";
import {Provider} from "react-redux";

const FORCE_ALL = true;

export interface ILabelSectionAttributes {
    allLabelVisible: boolean;
    allLabelHidden: boolean;
    allLabelTransparent: boolean;
    allLabelOpaque: boolean;
  }
  
 export interface IPredictionSectionAttributes {
    allPredictionVisible: boolean;
    allPredictionHidden: boolean;
    allPredictionTransparent: boolean;
    allPredictionOpaque: boolean;
    anyPredictionSelected: boolean;
  }

interface LabelTableComponentState {
    timerVar: any;
    filterEmptyRows: boolean;
    checkboxStatus: string;
    readyForPopout: boolean;
}

export interface LabelTableComponentProps {
    ready: boolean;
    itemMap: Map<MachineLearningLabel, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;
    isPoppedOut: boolean;
    readyForPopout: boolean;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelSelectionClick(itemId?: MachineLearningLabel): void;

    onLabelColorChange(newColor: ColorDef, name: MachineLearningLabel): void;

    onLabelExpandStateChange(newExpanded: boolean, name: MachineLearningLabel): void;

    onLabelApply(name: MachineLearningLabel): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionSelectionClick(itemId?: MachineLearningLabel): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;
}

export class LabelTableComponent extends React.Component<LabelTableComponentProps, LabelTableComponentState> {

    constructor(props: LabelTableComponentProps, ) {
        super(props);

        this.state = {
            timerVar: undefined,
            filterEmptyRows: false,
            checkboxStatus: "false",
            readyForPopout: false
        };

    }

    private handleColorChange = (name: MachineLearningLabel) => (color: ColorDef) => {
       this.props.onLabelColorChange(color, name);
      }
    
    private handleCheckboxChange = <T extends HTMLInputElement>(item: MLStateTableDataItem) => {

        return (event: React.SyntheticEvent<T>) => {

            let value: boolean | string;

            if (event.currentTarget.type === "checkbox") {
                value = (event.currentTarget as HTMLInputElement).checked;
            } else {
                value = event.currentTarget.value;
            }

            console.log("wasSelected = " + item.isSelected);

            this.setState({checkboxStatus: value.toString()});

            item.isSelected = (value.toString() === "true");

            console.log("item.name =>" + item.name + " state => " + value + "   isSelected = " + item.isSelected);

        };
    }

    private renderClassNameAndColorSection(level: number, isExpanded: boolean, item: MLStateTableDataItem, i18nName: string, hasChildren: boolean): JSX.Element {

        const simpleLine = "";
        const expandedCaret = "M1.4,3.3h13.3c0.5,0,0.8,0.6,0.5,1l-6.6,7.8c-0.3,0.3-0.7,0.3-1,0L0.9,4.3C0.6,3.9,0.8,3.3,1.4,3.3z";
        const collapsedCaret = "M3.5,14.6V1.3c0-0.5,0.6-0.8,1-0.5l7.8,6.6c0.3,0.3,0.3,0.7,0,1L4.5,15C4.2,15.4,3.5,15.1,3.5,14.6z";


        let expanderOrLine = simpleLine;
        if (hasChildren) {
            if (isExpanded) {
                expanderOrLine = expandedCaret;
            } else {
                expanderOrLine = collapsedCaret;
            }
        }

        return <>
            {/* <Checkbox onChange={handleCheckboxClick(item)}></Checkbox> */}

            <label /*key={this.state.checkboxStatus}*/ >
                <input
                    type="checkbox"
                    onChange={this.handleCheckboxChange(item!)}
                />
            </label>

            <div className="mltc-level-spacer" style={{minWidth: 16 * level}}/>
            <Button
                className="mltc-expand-button"
                style={{minWidth: 26, maxWidth: 28}}
                onClick={() => {
                    this.props.onLabelExpandStateChange(!isExpanded, item.name);
                }}
            >
                {/*<Icon iconSpec={iconClass}/>*/}
                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                    expanderOrLine
                ]}/>
            </Button>
            <ColorPickerButton
                className="sstc-color-picker-button"
                initialColor={item.color}
                onColorPick={this.handleColorChange(item.name)}
            />
            <div className="mltc-label-container-v2-small">
                {i18nName}
            </div>

        </>
    }

    private renderLabelSection(item: MLStateTableDataItem, i18nName: string, trueDisplayedCount: number): JSX.Element {
        return <>
            {/* <AppearanceToggleComponent
                transparencyAvailable={true}
                label={i18nName}
                itemId={item.name}
                visible={item.trueLabelIsDisplayed}
                transparent={item.trueLabelIsTransparent}
                onClick={this.props.onLabelDisplayChange}/>
            <GroupSelectButtonComponent
                label={i18nName}
                itemId={item.name}
                hilite={item.trueLabelSelectedCount !== 0}
                onClick={this.props.onLabelSelectionClick}/>
            <AssignLabelButton label={i18nName} name={item.name}
                               onClick={this.props.onLabelApply}/> */}
            <div className="sstc-count-container-v2">
                {trueDisplayedCount}
            </div>
        </>
    }

    private renderPredictionSection(item: MLStateTableDataItem, i18nName: string, predDisplayedCount: number): JSX.Element {
        return <>
            {/* <AppearanceToggleComponent
                transparencyAvailable={true}
                label={i18nName}
                itemId={item.name}
                visible={item.predLabelIsDisplayed}
                transparent={item.predLabelIsTransparent}
                onClick={this.props.onPredictionDisplayChange}
            />
            <GroupSelectButtonComponent
                label={i18nName}
                itemId={item.name}
                hilite={item.predLabelSelectedCount !== 0}
                onClick={this.props.onPredictionSelectionClick}/> */}
            <div className="sstc-count-container-v2">
                {predDisplayedCount}
            </div>
        </>
    }

    public static getSectionAttributes(props: any): any {

        const onlyShowPresent = true;

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


        for (const item of props.itemMap.values()) {
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

        return [anyLabelSelected, labelSectionAttributes, predSectionAttributes];
    }

    private renderTable(): JSX.Element {

        const onlyShowPresent = true;

        const tableRows: JSX.Element[] = [];

        const [anyLabelSelected, labelSectionAttributes, predSectionAttributes] = LabelTableComponent.getSectionAttributes(this.props);

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean, hasChildren: boolean) => {

            if (!onlyShowPresent || FORCE_ALL || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);

                const trueDisplayedCount = anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = predSectionAttributes.anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;

                if (this.state.filterEmptyRows === false || trueDisplayedCount !== 0 || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td-v2" style={{whiteSpace: "nowrap"}}>
                                {this.renderClassNameAndColorSection(level, isExpanded, item, i18nName, hasChildren)}
                            </td>
                            <td className="mltc-label-td-v2" align={"right"} style={{whiteSpace: "nowrap"}}>
                                {this.renderLabelSection(item, i18nName, trueDisplayedCount)}
                            </td>
                            <td className="mltc-prediction-td-v2" align={"right"} style={{whiteSpace: "nowrap"}}>
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
            processItem(item, treeItem.level, treeItem.isExpanded, treeItem.children.length !== 0);
            if (treeItem.isExpanded) {
                for (const child of treeItem.children) {
                    _recurse(child);
                }
            }
        }

        for (const entry of this.props.labelTree) {
            _recurse(entry);
        }

        return <>
            <Provider store={LabelerState.store}>
                <div className="sstc-data-container">
                    <table className="sstc-data-table">
                        {!this.props.isPoppedOut && <ConnectedLabelTableHeader />}
                        {this.props.isPoppedOut && <ConnectedLabelTableHeaderPopout />}
                        <tbody>
                        {tableRows}
                        </tbody>
                    </table>
                </div>
            
                <ConnectedLabelTableFooter/>
            </Provider>

        </>;
    }

    private renderLoading (): JSX.Element {
        return <>
            <div className="sstc-spinner-container">
                <div className="sstc-spinner-inner-container">
                    <Spinner size={SpinnerSize.XLarge}/>
                </div>
            </div>
        </>
      }

    public render() {
        return <>
            {!this.props.ready && this.renderLoading()}
            {this.props.ready && this.renderTable()}
        </>;
    }
}
