import {LabelTreeEntry, MLStateTableDataItem} from "../store/LabelingWorkflowTypes";
import {MachineLearningColorMode, MachineLearningLabel} from "../data/LabelTypes";
import {Id64String} from "@bentley/bentleyjs-core";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../LabelingWorkflowManager";
import {Dispatch} from "react";
import {connect} from "react-redux";
import {ColorDef} from "@bentley/imodeljs-common";
import {LabelingWorkflowState} from "../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../store/LabelingWorkflowSelectors";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../store/LabelingWorkflowActions";
import {MLStateTableComponentV2} from "./MLStateTable/LabelTable";

interface StateFromProps {
    ready: boolean;
    itemMap: Map<MachineLearningLabel, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    canUndo: boolean;
    canRedo: boolean;
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;
    poppedOut: boolean;
    readyForPopout: boolean;

    onLabelSelectionClick(itemId?: MachineLearningLabel): void;

    onPredictionSelectionClick(itemId?: MachineLearningLabel): void;

    onSave(): void;
}

interface DispatchFromProps {
    onLabelExpandStateChange(newExpanded: boolean, name: MachineLearningLabel): void;

    onLabelColorChange(newColor: ColorDef, name: MachineLearningLabel): void;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelApply(name: MachineLearningLabel): void;

    onUndo(): void;

    onRedo(): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;
}

const mapStateToProps = (rootState: any): StateFromProps => {
    const state = rootState[LabelingWorkflowManager.stateKey] as LabelingWorkflowState | undefined;
    console.log('mapStateToProps3 => !state is state == ' + JSON.stringify(state));
    if (!state) {
        throw new Error();
    }
    return {
        ready: state.ready,
        itemMap: LabelingWorkflowManagerSelectors.mlTableData(state),
        labelTree: LabelingWorkflowManagerSelectors.treeData(state),
        canUndo: LabelingWorkflowManagerSelectors.canUndo(state),
        canRedo: LabelingWorkflowManagerSelectors.canRedo(state),
        availableColorModes: AVAILABLE_COLOR_MODES,
        currentColorMode: state.colorMode,
        isDirty: state.elementStateMapIsDirty,
        poppedOut: false,
        readyForPopout: false,
        onLabelSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
}

const mapStateToPropsForPopout = (rootState: any): StateFromProps => {
    const state = rootState[LabelingWorkflowManager.stateKey] as LabelingWorkflowState | undefined;
    if (!state) {
        throw new Error();
    }

    let stateProps3 = mapStateToProps (rootState);
    stateProps3["poppedOut"] = true;
    return stateProps3;
}

const mapDispatchToProps = (dispatch: Dispatch<LabelingWorkflowManagerAction>): DispatchFromProps => ({
    onLabelExpandStateChange: (newExpanded: boolean, name: MachineLearningLabel) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
            newExpanded: newExpanded,
            label: name,
        })
    },
    onLabelColorChange: (newColor: ColorDef, name: MachineLearningLabel) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
            newColor: newColor,
            label: name,
        })
    },
    onLabelDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
            label: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onPredictionDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
            label: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onLabelApply: (name: MachineLearningLabel): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged,
            label: name,
        });
    },
    onUndo: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.UndoWasRequested,
        });
    },
    onRedo: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.RedoWasRequested,
        });
    },
    onChangeColorMode: (colorMode: MachineLearningColorMode) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: colorMode,
        });
    },
    onSwapTruePredDisplay: () => {
        dispatch({
            type: LabelingWorkflowManagerActionType.VisiblityStatesSwapped,
        });
    },
});



export const ConnectedMLTableComponentV2 = connect<StateFromProps, DispatchFromProps>(mapStateToProps, mapDispatchToProps)(MLStateTableComponentV2);

export const ConnectedMLTableComponentV2Popout = connect<StateFromProps, DispatchFromProps>(mapStateToPropsForPopout, mapDispatchToProps)(MLStateTableComponentV2);