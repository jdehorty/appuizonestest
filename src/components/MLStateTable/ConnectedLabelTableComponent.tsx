import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import {MachineLearningColorMode, MLLabelId} from "../../data/LabelTypes";
import {Id64String} from "@bentley/bentleyjs-core";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../../LabelingWorkflowManager";
import {Dispatch} from "react";
import {connect} from "react-redux";
import {ColorDef} from "@bentley/imodeljs-common";
import {LabelingWorkflowState} from "../../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../../store/LabelingWorkflowSelectors";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActions";
import {LabelTableComponent} from "./LabelTableComponent";
import {RootState} from "../../store/AppState";

export interface LabelTableStateFromProps {
    ready: boolean;
    itemMap: Map<MLLabelId, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    canUndo: boolean;
    canRedo: boolean;
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;
    isPoppedOut: boolean;
    readyForPopout: boolean;
    filterEmptyRows: boolean;
    selectedItems: Map<MLLabelId, MLStateTableDataItem>;

    onLabelSelectionClick(itemId?: MLLabelId): void;

    onPredictionSelectionClick(itemId?: MLLabelId): void;

    onSave(): void;

}

export interface LabelTableDispatchFromProps {
    onLabelExpandStateChange(newExpandedState: boolean, id: MLLabelId): void;

    onCheckboxStateChange(newItem: boolean, id: MLLabelId): void;

    onLabelColorChange(newColor: ColorDef, name: MLLabelId): void;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelApply(name: MLLabelId): void;

    onUndo(): void;

    onRedo(): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;

    onFilterEmptyRowsChange(filterEmptyRowsFlag: boolean): void;

    onAddSelectedLabelItem(item: MLStateTableDataItem): void;

    onRemoveSelectedLabelItem(item: MLStateTableDataItem): void;

    onReplaceSelectedLabelItem(newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem): void;
}

export function mapLabelTableStateToProps(rootState: RootState): LabelTableStateFromProps {
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
        isPoppedOut: false,
        readyForPopout: false,
        filterEmptyRows: state.filterEmptyRows,
        selectedItems: state.selectedItems,
        
        onLabelSelectionClick: (itemId?: MLLabelId): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MLLabelId): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
}

export function mapLabelTableStateToPropsForPopout(rootState: RootState): LabelTableStateFromProps {
    const state = rootState.labelingWorkflowManagerState as LabelingWorkflowState | undefined;
    if (!state) {
        throw new Error();
    }

    let stateProps3 = mapLabelTableStateToProps(rootState);
    stateProps3["isPoppedOut"] = true;
    return stateProps3;
}

export function mapLabelTableDispatchToProps(dispatch: Dispatch<LabelingWorkflowManagerAction>): LabelTableDispatchFromProps {
    return ({
        onLabelExpandStateChange: (newExpandedState: boolean, name: MLLabelId) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
                newState: newExpandedState,
                MLLabelId: name,
            });
        },
        onLabelColorChange: (newColor: ColorDef, name: MLLabelId) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
                newColor: newColor,
                MLLabelId: name,
            });
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
        onFilterEmptyRowsChange: (filterEmptyRowsFlag: boolean) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.FilterEmptyRowsChanged,
                filterEmptyRows: filterEmptyRowsFlag
            });
        },
        onAddSelectedLabelItem: (item: MLStateTableDataItem) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
                labelItemToSelectOrUnselect: item
            })
        },
        onRemoveSelectedLabelItem: (item: MLStateTableDataItem) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.RemoveSelectedLabelItem,
                labelItemToSelectOrUnselect: item
            })
        },
        onReplaceSelectedLabelItem(newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem) {
            dispatch({
                type: LabelingWorkflowManagerActionType.ReplaceSelectedLabelItem,
                labelItemToSelectOrUnselect: newItem,
                existingLabelItemToReplaceInSelection: oldItem
            })
        },
        onCheckboxStateChange: (newCheckboxState: boolean, name: string) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.CheckboxStateWasChanged,
                newCheckboxState: newCheckboxState,
                MLLabelId: name,
            })
        }
    });
}

export const ConnectedLabelTableComponent = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableComponent);

export const ConnectedLabelTableComponentPopout = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToPropsForPopout, mapLabelTableDispatchToProps)(LabelTableComponent);
