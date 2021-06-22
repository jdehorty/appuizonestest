/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ElementState, ECClassState, ModelState, CategoryState, PredLabelState, TrueLabelState, CommonLabelState } from "../state/LWState";
import { Id64String, Id64Set, Id64Array } from "@bentley/bentleyjs-core";
import { MachineLearningLabel, MachineLearningColorMode } from "../../data/LabelTypes";
import { ScreenViewport } from "@bentley/imodeljs-frontend";
import { Frustum, ColorDef } from "@bentley/imodeljs-common";
import { MLStateTableDataItem } from "../types/LWTypes";
import { LabelingWorkflowManagerActionType } from "../actionTypes/LWActionTypes";

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
