import { ElementState, ECClassState, ModelState, CategoryState, PredLabelState, TrueLabelState, CommonLabelState } from "./LabelingWorkflowState";
import { Id64String, Id64Set, Id64Array } from "@bentley/bentleyjs-core";
import { MachineLearningLabel, MachineLearningColorMode } from "../data/LabelTypes";
import { ScreenViewport } from "@bentley/imodeljs-frontend";
import { Frustum, ColorDef } from "@bentley/imodeljs-common";
import { MLStateTableDataItem } from "./LabelingWorkflowTypes";

/** Reducer action type */
export enum LabelingWorkflowManagerActionType {
    AddSelectedLabelItem = "LabelingWorkflowManagerActionType.AddSelectedLabelItem",
    CategoryVisibilityWasChanged = "LabelingWorkflowManagerActionType.CategoryVisibilityWasChanged",
    ClassVisibilityWasChanged = "LabelingWorkflowManagerActionType.ClassVisibilityWasChanged",
    ClearSelectedUiItems = "LabelingWorkflowManagerActionType.ClearSelectedUiItems",
    ColorModeWasChanged = "LabelingWorkflowManagerActionType.ColorModeWasChanged",
    CycleModeActionStarted = "LabelingWorkflowManagerActionType.CycleModeActionStarted",
    CycleModeIndexWasChanged = "LabelingWorkflowManagerActionType.CycleModeIndexWasChanged",
    CycleModeWasDisabled = "LabelingWorkflowManagerActionType.CycleModeWasDisabled",
    CycleModeWasEnabled = "LabelingWorkflowManagerActionType.CycleModeWasEnabled",
    DataWasInitialized = "LabelingWorkflowManagerActionType.DataWasInitialized",
    ElementLabelsWereChanged = "LabelingWorkflowManagerActionType.ElementLabelsWereChanged",
    ElementSelectionHasChanged = "LabelingWorkflowManagerActionType.SelectionHasChanged",
    FilterEmptyRowsChanged = "LabelingWorkflowManagerActionType.FilterEmptyRowsChanged",
    ForceShowAllChanged = "LabelingWorkflowManagerActionType.ForceShowAllChanged",
    LabelColorWasChanged = "LabelingWorkflowManagerActionType.LabelColorWasChanged",
    LabelExpandStateWasChanged = "LabelingWorkflowManagerActionType.LabelExpandStateWasChanged",
    LabelsWereSaved = "LabelingWorkflowManagerActionType.LabelsWereSaved",
    ModelVisibilityWasChanged = "LabelingWorkflowManagerActionType.ModelVisibilityWasChanged",
    PredLabelVisibilityWasChanged = "LabelingWorkflowManagerActionType.PredictionVisibilityWasChanged",
    RedoWasRequested = "LabelingWorkflowManagerActionType.RedoWasRequested",
    RemoveSelectedLabelItem = "LabelingWorkflowManagerActionType.RemoveSelectedLabelItem",
    ReplaceSelectedLabelItem = "LabelingWorkflowManagerActionType.ReplaceSelectedLabelItem",
    SelectionLabelWasChanged = "LabelingWorkflowManagerActionType.SelectionLabelWasChanged",
    ToggleLabelTableEmphasis = "LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis",
    TrueLabelVisibilityWasChanged = "LabelingWorkflowManagerActionType.LabelVisibilityWasChanged",
    UndoWasRequested = "LabelingWorkflowManagerActionType.UndoWasRequested",
    VisiblityStatesSwapped = "LabelingWorkflowManagerActionType.VisiblityStatesSwapped",
}

/** Reducer action */
export interface LabelingWorkflowManagerAction {
    /** Action type */
    type: LabelingWorkflowManagerActionType;
    /** State map for models */
    modelStateMap?: Map<Id64String, ModelState>;
    /** State map for categories */
    categoryStateMap?: Map<Id64String, CategoryState>;
    /** State map for classes */
    classStateMap?: Map<Id64String, ECClassState>;
    /** State map for machine learning labels */
    trueLabelStateMap?: Map<MachineLearningLabel, TrueLabelState>;
    /** State map for machine learning predictions */
    predLabelStateMap?: Map<MachineLearningLabel, PredLabelState>;
    /** Common state map for labels */
    commonLabelStateMap?: Map<MachineLearningLabel, CommonLabelState>;

    colorMode?: MachineLearningColorMode;
    cycleList?: Id64Array;
    displayed?: boolean;
    elementId?: Id64String;
    elementSet?: Id64Set;
    elementStateMap?: Map<Id64String, ElementState>;
    existingLabelItemToReplaceInSelection?: MLStateTableDataItem;
    filterEmptyRows?: boolean;
    initialFrustums?: Map<ScreenViewport, Frustum>;
    label?: MachineLearningLabel;
    labelItemToSelectOrUnselect?: MLStateTableDataItem;
    newColor?: ColorDef;
    newExpanded?: boolean;
    newForceShowAll?: boolean;
    newIndex?: number;
    transparent?: boolean;
}
