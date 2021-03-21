import {Id64String} from "@bentley/bentleyjs-core";
import {ColorDef} from "@bentley/imodeljs-common";
import {Spinner, SpinnerSize} from "@bentley/ui-core";
import * as React from "react";
import {MachineLearningColorMode, MachineLearningLabel} from "../../data/LabelTypes";
import "../../styles/LabelingWorkflowStylesV2.scss";
import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
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

    onFilterEmptyRowsChange(filterEmptyRowsFlag: boolean): void;
}

export class LabelTableComponent extends React.Component<LabelTableComponentProps, LabelTableComponentState> {

    constructor(props: LabelTableComponentProps,) {
        super(props);

        this.state = {
            timerVar: undefined,
            checkboxStatus: "false",
            readyForPopout: false
        };

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

    public render() {
        return <>
            {!this.props.ready && this.renderLoading()}
            {this.props.ready && this.renderTable()}
        </>;
    }

    private renderTable(): JSX.Element {
        return <>
            <Provider store={LabelerState.store}>
                <div className="sstc-data-container">
                    <table className="sstc-data-table">
                        {!this.props.isPoppedOut && <ConnectedLabelTableHeader/>}
                        {this.props.isPoppedOut && <ConnectedLabelTableHeaderPopout/>}
                        <ConnectedLabelTableBody/>
                    </table>
                </div>
                <ConnectedLabelTableFooter/>
            </Provider>
        </>;
    }

    private renderLoading(): JSX.Element {
        return <>
            <div className="sstc-spinner-container">
                <div className="sstc-spinner-inner-container">
                    <Spinner size={SpinnerSize.XLarge}/>
                </div>
            </div>
        </>
    }
}
