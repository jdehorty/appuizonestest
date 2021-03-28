import React, {FC, useState} from 'react';
import {connect} from 'react-redux';
import {IModelApp} from "@bentley/imodeljs-frontend";
import {Config} from "@bentley/bentleyjs-core";
import {Button, SvgPath} from "@bentley/ui-core";
import {MachineLearningLabel} from "../../data/LabelTypes";
import {ColorDef} from "@bentley/imodeljs-common";

import {
    LabelTableDispatchFromProps,
    LabelTableStateFromProps,
    mapLabelTableDispatchToProps,
    mapLabelTableStateToProps
} from "./ConnectedLabelTableAllComponent";
import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import {LabelTableAllComponent} from "./LabelTableAllComponent";
import {ColorPickerButton} from "@bentley/ui-components";
import {LabelButtonComponent} from "../LabelButtonComponent";
import VisibilityButtonComponent from "../VisibilityButtonComponent";


interface OwnProps extends LabelTableDispatchFromProps {
}

type Props = OwnProps & ReturnType<typeof mapLabelTableStateToProps>;

const FORCE_ALL = true;

const addItemToSelectedItems = (props: OwnProps,
                                item: MLStateTableDataItem,
                                selectedUiItems: Map<MachineLearningLabel, MLStateTableDataItem>,
                                allowMultiSelection: boolean): void => {
    if (allowMultiSelection) {
        // multi-selections are not supported yet, but if we need them in future, this is where we'd handle their selection.
    } else { // We are running in single-selection mode.
        if (selectedUiItems.get(item.name) != null) {
            // It is already there. Return; 
            return;
        }

        // Check for add vs. replace action.
        if (selectedUiItems.size == 0) {
            // Trigger Redux action to "Add new item".
            props.onAddSelectedLabelItem(item);
        } else { // Trigger a single Redux action to replace the existing single-select item with the new single-select item.
            // Since we are in single selection mode, the one and only element will be the first one. (Given a fresh iterator, "next"
            // will return the first (and in our single-select case, the only) one.
            const existingItem: MLStateTableDataItem = selectedUiItems.values().next().value;
            props.onReplaceSelectedLabelItem(item, existingItem);
        }
    }
}

const removeItemFromSelectedItems = (props: OwnProps,
                                     item: MLStateTableDataItem,
                                     selectedUiItems: Map<MachineLearningLabel, MLStateTableDataItem>): void => {

    if (selectedUiItems.size == 0) {
        return; // It is not in the list. Nothing to do. Return;
    }

    const existingItemInMap = selectedUiItems.get(item.name);
    if (existingItemInMap == null) {
        return; // It is not in the list. Nothing to do. Return; 
    }

    // Trigger Redux action to "remove item from list.
    props.onRemoveSelectedLabelItem(item);
}

const LabelTableBody: FC<Props> = (props) => {

    const [allowMultiSelectionOfLabels, setAllowMultiSelectionOfLabels] = useState(Config.App.getBoolean("allowMultiSelectionOfLabels"));

    const handleColorChange = (name: MachineLearningLabel) => (color: ColorDef) => {
        props.onLabelColorChange(color, name);
    }

    const itemSelectChangeHandler = <T extends HTMLInputElement>(item: MLStateTableDataItem) => {
        return (event: React.SyntheticEvent<T>) => {
            let value: boolean | string;
            if (event.currentTarget.type === "checkbox") {
                value = (event.currentTarget as HTMLInputElement).checked;
            } else {
                value = event.currentTarget.value;
            }
            item.isSelected = (value.toString() === "true");
            if (item.isSelected) {
                addItemToSelectedItems(props, item, props.selectedUiItems, allowMultiSelectionOfLabels);
            } else {
                removeItemFromSelectedItems(props, item, props.selectedUiItems);
            }
        };
    }

    const itemIsChecked = (item: MLStateTableDataItem): boolean => {
        const existingItem = props.selectedUiItems.get(item!.name);
        return (existingItem != null);
    }

    const jsxForClassNameAndColorSection = (level: number, isExpanded: boolean, item: MLStateTableDataItem, i18nName: string, hasChildren: boolean): JSX.Element => {

        const expanderStyle = {
            width: '24px',
            height: '22px',
        }
        const simpleLine = "";
        const expandedCaret = "M1.4,3.3h13.3c0.5,0,0.8,0.6,0.5,1l-6.6,7.8c-0.3,0.3-0.7,0.3-1,0L0.9,4.3C0.6,3.9,0.8,3.3,1.4,3.3z";
        const collapsedCaret = "M3.5,14.6V1.3c0-0.5,0.6-0.8,1-0.5l7.8,6.6c0.3,0.3,0.3,0.7,0,1L4.5,15C4.2,15.4,3.5,15.1,3.5,14.6z";

        const selectedItem = props.selectedUiItems.get(item.name);
        const itemIsSelected = selectedItem != null;


        let expanderOrLine = simpleLine;
        if (hasChildren) {
            if (isExpanded) {
                expanderOrLine = expandedCaret;
            } else {
                expanderOrLine = collapsedCaret;
            }
        }

        return <>
            <label>
                <input
                    type="checkbox"
                    checked={itemIsChecked(item!)}
                    onChange={itemSelectChangeHandler(item!)}
                />
            </label>
            <VisibilityButtonComponent
                transparencyAvailable={true}
                label={i18nName}
                itemId={item.name}
                visible={item.trueLabelIsDisplayed}
                transparent={item.trueLabelIsTransparent}
                onClick={props.onLabelDisplayChange}
            />
            <div className="mltc-level-spacer" style={{minWidth: 12 * level}}/>
            <Button
                className="mltc-expand-button"
                style={expanderStyle}
                onClick={() => {
                    props.onLabelExpandStateChange(!isExpanded, item.name);
                }}
            >
                {/*<Icon iconSpec={iconClass}/>*/}
                <SvgPath
                    viewBoxWidth={16}
                    viewBoxHeight={16}
                    paths={[
                        expanderOrLine
                    ]}
                />
            </Button>

            <ColorPickerButton
                className="sstc-color-picker-button"
                initialColor={item.color}
                onColorPick={handleColorChange(item.name)}
            />

            <div className="mltc-label-container-v2-small">
                {i18nName}
                <LabelButtonComponent
                    label={i18nName}
                    name={item.name}
                    onClick={props.onLabelApply}
                />
            </div>
        </>
    }

    const jsxForLabelSection = (item: MLStateTableDataItem, i18nName: string, trueDisplayedCount: number): JSX.Element => {
        return <>
            <div className="mltc-level-spacer"/>
            <div className="sstc-count-container-v2">
                {trueDisplayedCount}
            </div>
        </>
    }

    const jsxForPredictionSection = (item: MLStateTableDataItem, i18nName: string, predDisplayedCount: number): JSX.Element => {
        const uiItemIsSelected: boolean = props.selectedUiItems.get(item.name) != null;
        let predCountClass = "sstc-count-container-v2 ";
        predCountClass += (props.selectionSet.size > 0 && uiItemIsSelected) ? "on" : "off";
        return <>
            <div className={predCountClass}>
                {predDisplayedCount}
            </div>
        </>
    }

    const jsxForTableRows = (): JSX.Element => {

        const onlyShowPresent = true;

        const tableRows: JSX.Element[] = [];

        const [anyLabelSelected, labelSectionAttributes, predSectionAttributes] = LabelTableAllComponent.getSectionAttributes(props);

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean, hasChildren: boolean) => {

            if (!onlyShowPresent || FORCE_ALL || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);

                const trueDisplayedCount = anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = predSectionAttributes.anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;

                const uiItemIsSelected: boolean = props.selectedUiItems.get(item.name) != null;
                let predCountClass = "mltc-prediction-td-v2 ";
                predCountClass += (props.selectionSet.size > 0 && uiItemIsSelected) ? "on" : "off";

                if (props.filterEmptyRows === false || trueDisplayedCount !== 0 || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td-v2">
                                {jsxForClassNameAndColorSection(level, isExpanded, item, i18nName, hasChildren)}
                            </td>
                            <td className="mltc-label-td-v2" align={"right"} style={{whiteSpace: "nowrap"}}>
                                {jsxForLabelSection(item, i18nName, trueDisplayedCount)}
                            </td>
                            <td className={predCountClass} align={"right"} style={{whiteSpace: "nowrap"}}>
                                {jsxForPredictionSection(item, i18nName, predDisplayedCount)}
                            </td>
                        </tr>
                    );
                }
            }
        }

        const _recurse = (treeItem: LabelTreeEntry) => {
            const item = props.itemMap.get(treeItem.name);
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

        for (const entry of props.labelTree) {
            _recurse(entry);
        }

        return <>
            <tbody>
            {tableRows}
            </tbody>
        </>;
    }

    return (
        <>
            {props.ready && jsxForTableRows()}
        </>
    );
};

export default connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableBody);
