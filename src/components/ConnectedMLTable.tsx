import {LabelTreeEntry, MLStateTableDataItem} from "../store/LabelingWorkflowTypes";
import {MachineLearningColorMode, MLLabelId} from "../data/LabelTypes";
import {Id64String} from "@bentley/bentleyjs-core";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../LabelingWorkflowManager";
import {Dispatch} from "react";
import {connect} from "react-redux";
import {MLStateTableComponent} from "./MLStateTable";
import {ColorDef} from "@bentley/imodeljs-common";
import {LabelingWorkflowState} from "../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../store/LabelingWorkflowSelectors";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../store/LabelingWorkflowActions";
import {RootState} from "../store/AppState";

interface StateFromProps3 {
    ready: boolean;
    itemMap: Map<MLLabelId, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    canUndo: boolean;
    canRedo: boolean;
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;

    onLabelSelectionClick(itemId?: MLLabelId): void;

    onPredictionSelectionClick(itemId?: MLLabelId): void;

    onSave(): void;
}

interface DispatchFromProps3 {
    onLabelExpandStateChange(newExpanded: boolean, name: MLLabelId): void;

    onLabelColorChange(newColor: ColorDef, name: MLLabelId): void;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelApply(name: MLLabelId): void;

    onUndo(): void;

    onRedo(): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;
}

const mapStateToProps3 = (rootState: RootState): StateFromProps3 => {
    const state = rootState.labelingWorkflowManagerState as LabelingWorkflowState | undefined;
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
        onLabelSelectionClick: (itemId?: MLLabelId): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MLLabelId): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
};

const mapDispatchToProps3 = (dispatch: Dispatch<LabelingWorkflowManagerAction>): DispatchFromProps3 => ({
    onLabelExpandStateChange: (newExpanded: boolean, name: MLLabelId) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
            newState: newExpanded,
            MLLabelId: name,
        })
    },
    onLabelColorChange: (newColor: ColorDef, name: MLLabelId) => {
        dispatch({
            type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
            newColor: newColor,
            MLLabelId: name,
        })
    },
    onLabelDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MLLabelId): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
            MLLabelId: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onPredictionDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MLLabelId): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
            MLLabelId: name,
            displayed: newVisible,
            transparent: newTransparent,
        });
    },
    onLabelApply: (name: MLLabelId): void => {
        dispatch({
            type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged,
            MLLabelId: name,
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

export const ConnectedMLTableComponent = connect<StateFromProps3, DispatchFromProps3>(mapStateToProps3, mapDispatchToProps3)(MLStateTableComponent);




