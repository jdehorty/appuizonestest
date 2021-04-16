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
import { LabelTableEmphasis } from '../../store/LabelingWorkflowState';

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
            // It is already there, then return;
            return;
        }

        // Check for add vs. replace action.
        if (selectedUiItems.size == 0) {
            // Trigger Redux action to "Add new item".
            props.onAddSelectedLabelItem(item);
        } else {
            // Trigger a single Redux action to replace the existing single-select item with the new single-select item.
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

    const jsxForClassNameAndColorSection = (level: number, isExpanded: boolean, item: MLStateTableDataItem, i18nName: string, hasChildren: boolean, labelsAreAllowed: boolean): JSX.Element => {

        const expanderStyle = {
            width: '24px',
            height: '22px',
        }

        const simpleLine = "";
        const expandedCaret = "M16 4.7 14.6 3.3 8 9.9 1.4 3.3 0 4.7 8 12.7z";
        const collapsedCaret = "m4.7 0l-1.4 1.4 6.6 6.6-6.6 6.6 1.4 1.4 8-8z";

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
            <div className="mltc-level-spacer" style={{minWidth: 1 + (12 * (level))}}/>
            
            {
                (props.labelTableEmphasis == LabelTableEmphasis.ActOnLabels) &&
                    <VisibilityButtonComponent
                        transparencyAvailable={true}
                        label={i18nName}
                        itemId={item.name}
                        visible={item.trueLabelIsDisplayed}
                        transparent={item.trueLabelIsTransparent}
                        onClick={props.onLabelDisplayChange}
                    />
            }
             {
                (props.labelTableEmphasis == LabelTableEmphasis.ActOnPredictions) &&
                    <VisibilityButtonComponent
                        transparencyAvailable={true}
                        label={i18nName}
                        itemId={item.name}
                        visible={item.predLabelIsDisplayed}
                        transparent={item.predLabelIsTransparent}
                        onClick={props.onPredictionDisplayChange}
                    />
            }
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
                {labelsAreAllowed &&
                <LabelButtonComponent
                    label={i18nName}
                    name={item.name}
                    onClick={props.onLabelApply}
                />
                }
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
     
        return <>
            <div>
                {predDisplayedCount}
            </div>
        </>
    }

    const jsxForTableRows = (): JSX.Element => {

        const onlyShowPresent = true;

        const tableRows: JSX.Element[] = [];

        const [labelSectionAttributes, predSectionAttributes] = LabelTableAllComponent.getSectionAttributes(props);

        const labelsAreAllowed = props.selectionSet.size > 0;

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean, hasChildren: boolean, labelsAreAllowed: boolean) => {

            if (!onlyShowPresent || FORCE_ALL || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);

                const trueDisplayedCount = labelSectionAttributes.anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = predSectionAttributes.anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;

                let predCountClass = "mltc-prediction-td-v2 ";
                // const uiItemIsSelected: boolean = props.selectedUiItems.get(item.name) != null;
                //predCountClass += (props.selectionSet.size > 0 && uiItemIsSelected) ? "on" : "off";

                if (props.filterEmptyRows === false || trueDisplayedCount !== 0 || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td-v2">
                                {jsxForClassNameAndColorSection(level, isExpanded, item, i18nName, hasChildren, labelsAreAllowed)}
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
            processItem(item, treeItem.level, treeItem.isExpanded, treeItem.children.length !== 0, labelsAreAllowed);
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
