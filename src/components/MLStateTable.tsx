import {Id64String} from "@bentley/bentleyjs-core";
import {ColorDef} from "@bentley/imodeljs-common";
import {IModelApp} from "@bentley/imodeljs-frontend";
import {ColorPickerButton} from "@bentley/ui-components";
import {Button, ButtonType, Icon, LabeledToggle, Spinner, SpinnerSize, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import {useState} from "react";
import {MachineLearningColorMode, MachineLearningLabel} from "../data/LabelTypes";
import '../styles/LabelingWorkflowStyles.scss';
import {LabelTreeNode, MLStateTableDataItem} from "../store/LabelingWorkflowTypes";
import {AppearanceBatchToggleComponent} from "./AppearanceBatchToggle";
import {AppearanceToggleComponent} from "./AppearanceToggle";
import {AssignLabelButton} from "./AssignLabelButton";
import {GroupSelectButtonComponent} from "./GroupSelectButton";

interface Props {
    ready: boolean;
    itemMap: Map<MachineLearningLabel, MLStateTableDataItem>;
    labelTree: LabelTreeNode[];
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

const MLStateTableComponent = (props: Props) => {
    const [filterEmptyRows, setFilterEmptyRows] = useState(false);

    const handleColorModeChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        if (event.target !== undefined) {
            const colorMode = event.target.value as MachineLearningColorMode;
            props.onChangeColorMode(colorMode);
        }
    }

    const renderLoading = () => {
        return <>
            <div className="sstc-spinner-container">
                <div className="sstc-spinner-inner-container">
                    <Spinner size={SpinnerSize.XLarge}/>
                </div>
            </div>
        </>
    }

    const handleColorChange = (name: MachineLearningLabel) => (color: ColorDef) => {
        props.onLabelColorChange(color, name);
    }

    const renderTable = () => {
        const onlyShowPresent = true;
        const tableRows: JSX.Element[] = [];
        let allLabelVisible = true;
        let allLabelHidden = true;
        let allLabelTransparent = true;
        let allLabelOpaque = true;
        let anyLabelSelected = false;
        let allPredictionVisible = true;
        let allPredictionHidden = true;
        let allPredictionTransparent = true;
        let allPredictionOpaque = true;
        let anyPredictionSelected = false;

        for (const item of props.itemMap.values()) {
            if (!item.trueLabelIsDisplayed) {
                allLabelVisible = false;
            } else {
                allLabelHidden = false;
            }
            if (!item.trueLabelIsTransparent) {
                allLabelTransparent = false;
            } else {
                allLabelOpaque = false;
            }
            if (item.trueLabelSelectedCount !== 0) {
                anyLabelSelected = true;
            }
            if (!item.predLabelIsDisplayed) {
                allPredictionVisible = false;
            } else {
                allPredictionHidden = false;
            }
            if (!item.predLabelIsTransparent) {
                allPredictionTransparent = false;
            } else {
                allPredictionOpaque = false;
            }
            if (item.predLabelSelectedCount !== 0) {
                anyPredictionSelected = true;
            }
        }

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean) => {

            if (!onlyShowPresent || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);
                const trueDisplayedCount = anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;
                const activeCaret = isExpanded
                    ? "M1.4,3.3h13.3c0.5,0,0.8,0.6,0.5,1l-6.6,7.8c-0.3,0.3-0.7,0.3-1,0L0.9,4.3C0.6,3.9,0.8,3.3,1.4,3.3z"
                    : "M3.5,14.6V1.3c0-0.5,0.6-0.8,1-0.5l7.8,6.6c0.3,0.3,0.3,0.7,0,1L4.5,15C4.2,15.4,3.5,15.1,3.5,14.6z";

                if (filterEmptyRows === false
                    || trueDisplayedCount !== 0
                    || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td" style={{whiteSpace: "nowrap"}}>
                                <div className="mltc-level-spacer" style={{minWidth: 16 * level}}/>
                                <Button
                                    className="mltc-expand-button"
                                    style={{minWidth: 26, maxWidth: 28}}
                                    onClick={() => {
                                        props.onLabelExpandStateChange(!isExpanded, item.name);
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
                                    onColorPick={handleColorChange(item.name)}
                                />
                            </td>
                            <td className="mltc-label-td">
                                <AppearanceToggleComponent
                                    transparencyAvailable={true}
                                    label={i18nName}
                                    itemId={item.name}
                                    visible={item.trueLabelIsDisplayed}
                                    transparent={item.trueLabelIsTransparent}
                                    onClick={props.onLabelDisplayChange}/>
                                <GroupSelectButtonComponent
                                    label={i18nName}
                                    itemId={item.name}
                                    hilite={item.trueLabelSelectedCount !== 0}
                                    onClick={props.onLabelSelectionClick}/>
                                <AssignLabelButton label={i18nName} name={item.name}
                                                   onClick={props.onLabelApply}/>
                                <div className="sstc-count-container">
                                    {trueDisplayedCount}
                                </div>
                            </td>
                            <td className="mltc-prediction-td">
                                <AppearanceToggleComponent
                                    transparencyAvailable={true}
                                    label={i18nName}
                                    itemId={item.name}
                                    visible={item.predLabelIsDisplayed}
                                    transparent={item.predLabelIsTransparent}
                                    onClick={props.onPredictionDisplayChange}
                                />
                                <GroupSelectButtonComponent
                                    label={i18nName}
                                    itemId={item.name}
                                    hilite={item.predLabelSelectedCount !== 0}
                                    onClick={props.onPredictionSelectionClick}/>
                                <div className="sstc-count-container">
                                    {predDisplayedCount}
                                </div>
                            </td>
                        </tr>
                    );
                }
            }
        }

        const _recurse = (node: LabelTreeNode) => {
            const item = props.itemMap.get(node.name);
            if (item === undefined) return;
            processItem(item, node.level, node.isExpanded);
            if (node.isExpanded) {
                node.children.forEach(child => {
                    _recurse(child);
                });
            }
        }

        props.labelTree.forEach((node) => {
            _recurse(node);
        });

        const colorModeOptions: JSX.Element[] = [];
        for (const colorMode of props.availableColorModes) {
            const colorModeI18n = IModelApp.i18n.translate(colorMode);
            colorModeOptions.push(
                <option key={`color-mode-option-${colorMode}`} value={colorMode}>{colorModeI18n}</option>
            );
        }

        let headerStyle = {
            backgroundColor: "#ddd"
        }

        return <>
            <div className="sstc-data-container">
                <table className="sstc-data-table" style={{width: "100%"}}>
                    <thead style={{width: "100%"}}>
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
                                    isOn={filterEmptyRows}
                                    onChange={handleToggleFilter}
                                />
                            </div>
                            <Button
                                className="sstc-swap-button"
                                buttonType={ButtonType.Hollow}
                                onClick={props.onSwapTruePredDisplay}
                            >
                                <Icon iconSpec="icon-replace"/>
                            </Button>
                        </td>
                        <td className="mltc-label-td">
                            <AppearanceBatchToggleComponent
                                transparencyAvailable={true}
                                allHidden={allLabelHidden}
                                allVisible={allLabelVisible}
                                allTransparent={allLabelTransparent}
                                allOpaque={allLabelOpaque}
                                onClick={
                                    (newVisible: boolean, newTransparent: boolean) => {
                                        props.onLabelDisplayChange(newVisible, newTransparent, undefined);
                                    }
                                }
                            />
                            <GroupSelectButtonComponent label={IModelApp.i18n.translate("Labelereverything")}
                                                        onClick={() => {
                                                            props.onLabelSelectionClick(undefined);
                                                        }}/>
                        </td>
                        <td className="mltc-prediction-td">
                            <AppearanceBatchToggleComponent
                                transparencyAvailable={true}
                                allHidden={allPredictionHidden}
                                allVisible={allPredictionVisible}
                                allTransparent={allPredictionTransparent}
                                allOpaque={allPredictionOpaque}
                                onClick={
                                    (newVisible: boolean, newTransparent: boolean) => {
                                        props.onPredictionDisplayChange(newVisible, newTransparent, undefined);
                                    }
                                }
                            />
                            <GroupSelectButtonComponent label={IModelApp.i18n.translate("Labelereverything")}
                                                        onClick={() => {
                                                            props.onPredictionSelectionClick(undefined);
                                                        }}/>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    {tableRows}
                    </tbody>
                </table>
            </div>
            <div className="sstc-color-mode-container">
                <label className="sstc-color-mode-label">
                    {IModelApp.i18n.translate("LabelerState:colorMode")}
                    <select
                        className="sstc-color-mode-select"
                        value={props.currentColorMode}
                        onChange={handleColorModeChange}
                    >
                        {colorModeOptions}
                    </select>
                </label>
            </div>
            <div className="sstc-action-container">
                <Button className="sstc-control-button" onClick={props.onSave}
                        disabled={!props.isDirty}><Icon
                    iconSpec="icon-save"/></Button>&nbsp;
                <Button className="sstc-control-button" onClick={props.onUndo}
                        disabled={!props.canUndo}><Icon
                    iconSpec="icon-undo"/></Button>&nbsp;
                <Button className="sstc-control-button" onClick={props.onRedo}
                        disabled={!props.canRedo}><Icon
                    iconSpec="icon-redo"/></Button>&nbsp;
            </div>
        </>;
    }

    const handleToggleFilter = (enable: boolean) => {
        setFilterEmptyRows(enable);
    }

    return <>
        {!props.ready && renderLoading}
        {props.ready && renderTable}
    </>;
};

export default MLStateTableComponent;