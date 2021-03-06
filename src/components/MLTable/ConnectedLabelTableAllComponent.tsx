/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { LabelTreeEntry, MLStateTableDataItem } from "../../store/types/LWTypes";
import { MachineLearningColorMode, MachineLearningLabel } from "../../data/LabelTypes";
import { Id64Set, Id64String } from "@bentley/bentleyjs-core";
import { AVAILABLE_COLOR_MODES, LabelingWorkflowManager } from "../../LabelingWorkflowManager";
import { Dispatch } from "react";
import { connect } from "react-redux";
import { ColorDef } from "@bentley/imodeljs-common";
import { LWState, LabelTableEmphasis } from "../../store/state/LWState";
import { LabelingWorkflowManagerSelectors } from "../../store/selectors/LWSelectors";
import { LabelingWorkflowManagerAction } from "../../store/definitions/LWActionsDef";
import { LabelTableAllComponent } from "./LabelTableAllComponent";
import { RootStateType } from "../../store/AppState";
import * as actions from "../../store/actions/LabelTableAllComponentActions"
import {
    AddSelectedLabelItem,
    ChangeColorMode,
    ClearSelectedUiItems,
    FilterEmptyRowsChange,
    LabelApply,
    LabelColorChange,
    LabelDisplayChange,
    PredictionDisplayChange,
    Redo,
    RemoveSelectedLabelItem,
    ReplaceSelectedLabelItem,
    SwapTruePredDisplay,
    ToggleLabelTableEmphasis,
    Undo
} from "../../store/actions/LabelTableAllComponentActions"


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
    labelClassPoked: MachineLearningLabel | undefined;

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

    onClearSelection(): void;
}

export function mapLabelTableStateToProps(rootState: RootStateType): LabelTableStateFromProps {
    const state = rootState.labelingWorkflowManagerState as LWState | undefined;
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
        labelClassPoked: state.labelClassPoked,

        onLabelSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectLabel(itemId);
        },
        onPredictionSelectionClick: (itemId?: MachineLearningLabel): void => {
            LabelingWorkflowManager.selectPrediction(itemId);
        },
        onSave: LabelingWorkflowManager.saveLabels,
    };
}


export function mapLabelTableDispatchToProps(dispatch: Dispatch<LabelingWorkflowManagerAction>): {
    onUndo: () => void;
    onRedo: () => void;
    onChangeColorMode: (colorMode: MachineLearningColorMode) => void;
    onReplaceSelectedLabelItem(newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem): void;
    onLabelExpandStateChange: (newExpanded: boolean, name: MachineLearningLabel) => void;
    onClearSelection(): void;
    onRemoveSelectedLabelItem: (item: MLStateTableDataItem) => void;
    onLabelColorChange: (newColor: ColorDef, name: MachineLearningLabel) => void;
    onPredictionDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel) => void;
    onLabelDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel) => void;
    onSwapTruePredDisplay: () => void;
    onToggleLabelTableEmphasis(): void;
    onLabelApply: (name: MachineLearningLabel) => void;
    onFilterEmptyRowsChange: (filterEmptyRowsFlag: boolean) => void;
    onAddSelectedLabelItem: (item: MLStateTableDataItem) => void;
} {
    return ({
        onLabelExpandStateChange: (newExpanded: boolean, name: MachineLearningLabel) => {
            dispatch(actions.LabelExpandStateChange(newExpanded, name));
        },
        onLabelColorChange: (newColor: ColorDef, name: MachineLearningLabel) => {
            dispatch(LabelColorChange(newColor, name));
        },
        onLabelDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
            dispatch(LabelDisplayChange(name, newVisible, newTransparent));
        },
        onPredictionDisplayChange: (newVisible: boolean, newTransparent: boolean, name?: MachineLearningLabel): void => {
            dispatch(PredictionDisplayChange(name, newVisible, newTransparent));
        },
        onLabelApply: (name: MachineLearningLabel): void => {
            dispatch(LabelApply(name));
        },
        onUndo: () => {
            dispatch(Undo());
        },
        onRedo: () => {
            dispatch(Redo());
        },
        onChangeColorMode: (colorMode: MachineLearningColorMode) => {
            dispatch(ChangeColorMode(colorMode));
        },
        onSwapTruePredDisplay: () => {
            dispatch(SwapTruePredDisplay());
        },
        onFilterEmptyRowsChange: (filterEmptyRowsFlag: boolean) => {
            dispatch(FilterEmptyRowsChange(filterEmptyRowsFlag));
        },
        onAddSelectedLabelItem: (item: MLStateTableDataItem) => {
            dispatch(AddSelectedLabelItem(item))
        },
        onRemoveSelectedLabelItem: (item: MLStateTableDataItem) => {
            dispatch(RemoveSelectedLabelItem(item))
        },
        onReplaceSelectedLabelItem(newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem) {
            dispatch(ReplaceSelectedLabelItem(newItem, oldItem))
        },
        onToggleLabelTableEmphasis() {
            dispatch(ToggleLabelTableEmphasis());
            dispatch(SwapTruePredDisplay());
        },
        onClearSelection() {
            dispatch(ClearSelectedUiItems())
        }
    });
}

export const ConnectedLabelTableAllComponent = connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableAllComponent);

