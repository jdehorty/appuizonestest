import {LabelTreeEntry, MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import {MachineLearningColorMode, MachineLearningLabel} from "../../data/LabelTypes";
import {Id64String, Id64Set} from "@bentley/bentleyjs-core";
import {AVAILABLE_COLOR_MODES, LabelingWorkflowManager} from "../../LabelingWorkflowManager";
import {Dispatch} from "react";
import {connect} from "react-redux";
import {ColorDef} from "@bentley/imodeljs-common";
import {LabelingWorkflowState, LabelTableEmphasis} from "../../store/LabelingWorkflowState";
import {LabelingWorkflowManagerSelectors} from "../../store/LabelingWorkflowSelectors";
import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActions";
import {LabelTableAllComponent} from "./LabelTableAllComponent";
import {RootState} from "../../store/AppState";
import {Presentation} from "@bentley/presentation-frontend";
import {UiFramework} from "@bentley/ui-framework";


export interface LabelTableStateFromProps {
    ready: boolean;
    itemMap: Map<MachineLearningLabel, MLStateTableDataItem>;
    labelTree: LabelTreeEntry[];
    canUndo: boolean;
    canRedo: boolean;
    availableColorModes: MachineLearningColorMode[];
    currentColorMode: MachineLearningColorMode;
    isDirty: boolean;
    filterEmptyRows: boolean;
    selectedUiItems: Map<MachineLearningLabel, MLStateTableDataItem>;
    selectionSet: Id64Set;
    labelTableEmphasis: LabelTableEmphasis;

    onLabelSelectionClick(itemId?: MachineLearningLabel): void;

    onPredictionSelectionClick(itemId?: MachineLearningLabel): void;

    onSave(): void;
}

export interface LabelTableDispatchFromProps {
    onLabelExpandStateChange(newExpanded: boolean, name: MachineLearningLabel): void;

    onLabelColorChange(newColor: ColorDef, name: MachineLearningLabel): void;

    onLabelDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onPredictionDisplayChange(newVisible: boolean, newTransparent: boolean, itemId?: Id64String): void;

    onLabelApply(name: MachineLearningLabel): void;

    onUndo(): void;

    onRedo(): void;

    onChangeColorMode(colorMode: MachineLearningColorMode): void;

    onSwapTruePredDisplay(): void;

    onFilterEmptyRowsChange(filterEmptyRowsFlag: boolean): void;

    onAddSelectedLabelItem(item: MLStateTableDataItem): void;
    onRemoveSelectedLabelItem(item: MLStateTableDataItem): void;
    onReplaceSelectedLabelItem(newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem): void;

    onToggleLabelTableEmphasis(): void;
}

export function mapLabelTableStateToProps(rootState: RootState): LabelTableStateFromProps {
    const state = rootState.labelingWorkflowManagerState as LabelingWorkflowState | undefined;
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
        filterEmptyRows: state.filterEmptyRows,
        selectedUiItems: state.selectedUiItems,
        selectionSet: state.selectionSet,
        labelTableEmphasis: state.labelTableEmphasis,
        
        onLabelSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
}

export function mapLabelTableDispatchToProps(dispatch: Dispatch<LabelingWorkflowManagerAction>): LabelTableDispatchFromProps {
    return ({
        onLabelExpandStateChange: (newExpanded: boolean, name: MachineLearningLabel) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
                newExpanded: newExpanded,
                label: name,
            });
        },
        onLabelColorChange: (newColor: ColorDef, name: MachineLearningLabel) => {
            dispatch({
                type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
                newColor: newColor,
                label: name,
            });
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
        onToggleLabelTableEmphasis() {
            Presentation.selection.clearSelection("", UiFramework.getIModelConnection()!);

            dispatch ({
                type: LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis
            })
        }

        // Trigger Redux action to "Add new item".
        // TODO: Perform Redux action to add new item to SelectedItems.
        // 1. action.labelItemToSelectOrUnselect = item;
        // 2. dispatch LabelingWorkflowManagerActionType.AddSelectedLabelItem
    });
}

export const ConnectedLabelTableAllComponent = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableAllComponent);

