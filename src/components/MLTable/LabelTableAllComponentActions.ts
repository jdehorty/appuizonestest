/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {LabelingWorkflowManagerAction, LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActionsTypes";
import {MLStateTableDataItem} from "../../store/LabelingWorkflowTypes";
import {ColorDef} from "@bentley/imodeljs-common";
import {MachineLearningColorMode} from "../../data/LabelTypes";

export const LabelExpandStateChange = (newExpanded: boolean, name: string): LabelingWorkflowManagerAction => ({
    type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
    newExpanded: newExpanded,
    label: name,
});

export const LabelColorChange = (newColor: ColorDef, name: string) => ({
    type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
    newColor: newColor,
    label: name,
});

export const LabelDisplayChange = (name: string | undefined, newVisible: boolean, newTransparent: boolean) => ({
    type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
    label: name,
    displayed: newVisible,
    transparent: newTransparent,
});

export const PredictionDisplayChange = (name: string | undefined, newVisible: boolean, newTransparent: boolean) => ({
    type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
    label: name,
    displayed: newVisible,
    transparent: newTransparent,
});

export const LabelApply = (name: string) => ({
    type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged,
    label: name,
});

export const Undo = () => ({
    type: LabelingWorkflowManagerActionType.UndoWasRequested,
});

export const Redo = () => ({
    type: LabelingWorkflowManagerActionType.RedoWasRequested,
});

export const ChangeColorMode = (colorMode: MachineLearningColorMode) => ({
    type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
    colorMode: colorMode,
});

export const SwapTruePredDisplay = () => ({
    type: LabelingWorkflowManagerActionType.VisibilityStateWasSwapped,
});

export const FilterEmptyRowsChange = (filterEmptyRowsFlag: boolean) => ({
    type: LabelingWorkflowManagerActionType.FilterEmptyRowsChanged,
    filterEmptyRows: filterEmptyRowsFlag
});

export const AddSelectedLabelItem = (item: MLStateTableDataItem) => ({
    type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
    labelItemToSelectOrUnselect: item
});

export const RemoveSelectedLabelItem = (item: MLStateTableDataItem) => ({
    type: LabelingWorkflowManagerActionType.RemoveSelectedLabelItem,
    labelItemToSelectOrUnselect: item
});

export const ReplaceSelectedLabelItem = (newItem: MLStateTableDataItem, oldItem: MLStateTableDataItem) => ({
    type: LabelingWorkflowManagerActionType.ReplaceSelectedLabelItem,
    labelItemToSelectOrUnselect: newItem,
    existingLabelItemToReplaceInSelection: oldItem
});

export const ToggleLabelTableEmphasis = () => ({
    type: LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis
});

export const ClearSelectedUiItems = () => ({
    type: LabelingWorkflowManagerActionType.ClearSelectedUiItems
});