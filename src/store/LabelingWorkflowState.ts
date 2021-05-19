/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { Id64String, Id64Array, Id64Set } from "@bentley/bentleyjs-core";
import { MachineLearningLabel, MachineLearningColorMode } from "../data/LabelTypes";
import { ColorDef, Frustum } from "@bentley/imodeljs-common";
import { ScreenViewport } from "@bentley/imodeljs-frontend";
import { MLStateTableDataItem } from "./LabelingWorkflowTypes";

export interface BaseGroupState {
    displayLabel?: string;
    displayI18nKey?: string;
    isDisplayed: boolean;
    isTransparent: boolean;
}

export interface ModelState extends BaseGroupState {
    instanceId?: Id64String;
}

export interface CategoryState extends BaseGroupState {
    instanceId?: Id64String;
}

export interface ECClassState extends BaseGroupState {
    instanceId?: Id64String;
    classKey: string;
}

export interface TrueLabelState extends BaseGroupState {
    label: MachineLearningLabel;
}

export interface PredLabelState extends BaseGroupState {
    label: MachineLearningLabel;
}

export interface CommonLabelState {
    label: MachineLearningLabel;
    color: ColorDef;
    parentLabel?: MachineLearningLabel;
    childrenLabels: Array<MachineLearningLabel>;
    isExpanded: boolean;
}

export interface CycleModeState {
    working: boolean;
    enabled: boolean;
    currentIndex?: number;
    cycleList?: Id64Array;
    initialFrustums?: Map<ScreenViewport, Frustum>;
}

export enum LabelTableEmphasis {
    ActOnLabels = 0,
    ActOnPredictions = 1
}

/** State for a GeometricElement3d */
export interface ElementState {
    /** The element's ECInstanceId */
    elementId: Id64String;
    /** The model's ECInstanceId associated with the element */
    modelId: Id64String;
    /** The category's ECInstanceId associated with the element */
    categoryId: Id64String;
    /** The ECClassId associated with the element */
    classId: Id64String;
    /** The ECClass name associated with the element */
    className: string;
    /** The machine learning label associated with the element */
    trueLabel: MachineLearningLabel;
    /** The machine learning prediction associated with the element */
    predLabel: MachineLearningLabel;
    /** Auxiliary storage */
    auxData: any;
}


/** LabelingWorkflowManager state layout */
export interface LabelingWorkflowState {
    /** True if storage has finished loading */
    ready: boolean;
    /** State map for models */
    modelStateMap: Map<Id64String, ModelState>;
    /** State map for categories */
    categoryStateMap: Map<Id64String, CategoryState>;
    /** State map for classes */
    classStateMap: Map<Id64String, ECClassState>;
    /** State map for machine learning true labels */
    trueLabelStateMap: Map<MachineLearningLabel, TrueLabelState>;
    /** State map for machine learning predicted labels */
    predLabelStateMap: Map<MachineLearningLabel, PredLabelState>;
    /** Common state map for labels */
    commonLabelStateMap: Map<MachineLearningLabel, CommonLabelState>;
    /** True if changes were made to labels */
    elementStateMapIsDirty: boolean;
    /** State map history for GeometricElement3d elements (that have a geometry stream) */
    elementStateMapHistory: Map<Id64String, ElementState>[];
    /** Current index in history */
    elementStateMapIndex: number;
    /** Selection set, not filtered */
    selectionSet: Id64Set;
    /** Element cycling mode sub-state */
    cycleModeState: CycleModeState;
    /** Color override mode */
    colorMode: MachineLearningColorMode;
    /** Force show flag */
    forceShowAll: boolean;
    /** filtering out label rows with empty class counts */
    filterEmptyRows: boolean;
    /** Currently selected Label items in the ML State Table. 
     * Note: If Config.allowMultiSelectionOfLabels == false, then there will be no more than 1 selected label allowed at a time. */
    selectedUiItems: Map<MachineLearningLabel, MLStateTableDataItem>;
    /** Indicates whether bi-modal LabelTable controls are currently biased toward Labels or Predictions.  */
    labelTableEmphasis: LabelTableEmphasis;

    /**
     * The name of the last class that was clicked to indicate which class we're using to label selected elements
     */
    labelClassPoked: MachineLearningLabel;
}


/** Initial state for the reducer */
export const INITIAL_STATE: LabelingWorkflowState = {
    ready: false,
    modelStateMap: new Map<Id64String, BaseGroupState>(),
    categoryStateMap: new Map<Id64String, BaseGroupState>(),
    classStateMap: new Map<Id64String, ECClassState>(),
    trueLabelStateMap: new Map<MachineLearningLabel, TrueLabelState>(),
    predLabelStateMap: new Map<MachineLearningLabel, PredLabelState>(),
    commonLabelStateMap: new Map<MachineLearningLabel, CommonLabelState>(),
    elementStateMapIsDirty: false,
    elementStateMapHistory: [new Map<Id64String, ElementState>()],
    elementStateMapIndex: 0,
    selectionSet: new Set<Id64String>(),
    cycleModeState: {
        working: false,
        enabled: false
    },
    colorMode: MachineLearningColorMode.Native,
    forceShowAll: false,
    filterEmptyRows: false,
    selectedUiItems: new Map<MachineLearningLabel, MLStateTableDataItem>(),
    labelTableEmphasis: LabelTableEmphasis.ActOnLabels,
    labelClassPoked: ''
}
