import React, {FunctionComponent} from 'react';
import {connect} from 'react-redux';
import {IModelApp} from "@bentley/imodeljs-frontend";

import {Button, SvgPath} from "@bentley/ui-core";
import {MachineLearningLabel} from "../../data/LabelTypes";
import {ColorDef} from "@bentley/imodeljs-common";

import {
    LabelTableDispatchFromProps,
    LabelTableStateFromProps,
    mapLabelTableDispatchToProps,
    mapLabelTableStateToProps
} from "./LabelTableState";
import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import {LabelTableComponent, LabelTableComponentProps} from "./LabelTable";
import {ColorPickerButton} from "@bentley/ui-components";

const FORCE_ALL = true;

interface OwnProps extends LabelTableComponentProps {

}

type Props = OwnProps & ReturnType<typeof mapLabelTableStateToProps>;

const LabelTableBody: FunctionComponent<Props> = (props) => {

    const handleColorChange = (name: MachineLearningLabel) => (color: ColorDef) => {
        props.onLabelColorChange(color, name);
    }

    const handleCheckboxChange = <T extends HTMLInputElement>(item: MLStateTableDataItem) => {

        return (event: React.SyntheticEvent<T>) => {

            let value: boolean | string;

            if (event.currentTarget.type === "checkbox") {
                value = (event.currentTarget as HTMLInputElement).checked;
            } else {
                value = event.currentTarget.value;
            }

            console.log("wasSelected = " + item.isSelected);

            item.isSelected = (value.toString() === "true");

            console.log("item.name =>" + item.name + " state => " + value + "   isSelected = " + item.isSelected);

        };
    }

    const jsxForClassNameAndColorSection = (level: number, isExpanded: boolean, item: MLStateTableDataItem, i18nName: string, hasChildren: boolean): JSX.Element => {

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
            <label>
                <input
                    type="checkbox"
                    onChange={handleCheckboxChange(item!)}
                />
            </label>

            <div className="mltc-level-spacer" style={{minWidth: 16 * level}}/>
            <Button
                className="mltc-expand-button"
                style={{minWidth: 26, maxWidth: 28}}
                onClick={() => {
                    props.onLabelExpandStateChange(!isExpanded, item.name);
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
                onColorPick={handleColorChange(item.name)}
            />
            <div className="mltc-label-container-v2-small">
                {i18nName}
            </div>

        </>
    }

    const jsxForLabelSection = (item: MLStateTableDataItem, i18nName: string, trueDisplayedCount: number): JSX.Element => {
        return <>
            <div className="sstc-count-container-v2">
                {trueDisplayedCount}
            </div>
        </>
    }

    const jsxForPredictionSection = (item: MLStateTableDataItem, i18nName: string, predDisplayedCount: number): JSX.Element => {
        return <>
            <div className="sstc-count-container-v2">
                {predDisplayedCount}
            </div>
        </>
    }

    const renderTableRows = (): JSX.Element => {

        const onlyShowPresent = true;

        const tableRows: JSX.Element[] = [];

        const [anyLabelSelected, labelSectionAttributes, predSectionAttributes] = LabelTableComponent.getSectionAttributes(props);

        const processItem = (item: MLStateTableDataItem, level: number, isExpanded: boolean, hasChildren: boolean) => {

            if (!onlyShowPresent || FORCE_ALL || item.hasData) {

                const i18nName = IModelApp.i18n.translate(item.name);

                const trueDisplayedCount = anyLabelSelected ? item.trueLabelSelectedCount : item.trueLabelTotalCount;
                const predDisplayedCount = predSectionAttributes.anyPredictionSelected ? item.predLabelSelectedCount : item.predLabelTotalCount;

                if (props.filterEmptyRows === false || trueDisplayedCount !== 0 || predDisplayedCount !== 0) {
                    tableRows.push(
                        <tr key={'table-row-' + item.name}>
                            <td className="mltc-name-td-v2" style={{whiteSpace: "nowrap"}}>
                                {jsxForClassNameAndColorSection(level, isExpanded, item, i18nName, hasChildren)}
                            </td>
                            <td className="mltc-label-td-v2" align={"right"} style={{whiteSpace: "nowrap"}}>
                                {jsxForLabelSection(item, i18nName, trueDisplayedCount)}
                            </td>
                            <td className="mltc-prediction-td-v2" align={"right"} style={{whiteSpace: "nowrap"}}>
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
            {props.ready && renderTableRows()}
        </>
    );
};

export default connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableBody);
