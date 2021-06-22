/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ColorDef } from "@bentley/imodeljs-common";
import { INITIAL_STATE, LWState } from "../../store/state/LWState";
import {
    LabelingWorkflowManagerAction
} from "../../store/definitions/LWActionsDef";
import { LabelingWorkflowManagerActionType } from "../../store/actionTypes/LWActionTypes";
import { LabelingWorkflowManagerReducer as reducer } from "../../store/reducers/LWReducers";

function* getAppStateFactory(): Generator<LWState> {
    // Initial state
    yield INITIAL_STATE;

    // DataWasInitialized state
    let stateAfterDataWasInitialized = {
        ...INITIAL_STATE,
        ready: true
    }
    yield stateAfterDataWasInitialized;

    // AddSelectedLabelItem state
    let inputItemAddSelected = {
        name: 'MachineLearning:label.beam',
        color: ColorDef.blue,
        isSelected: true,
        hasData: true,
        trueLabelIsDisplayed: true,
        trueLabelIsTransparent: true,
        trueLabelTotalCount: 0,
        trueLabelVisibleCount: 0,
        trueLabelSelectedCount: 0,
        predLabelIsDisplayed: true,
        predLabelIsTransparent: false,
        predLabelTotalCount: 52,
        predLabelVisibleCount: 52,
        predLabelSelectedCount: 0
    };
    const stateAfterSelectedItemAdd = reducer(stateAfterDataWasInitialized, <LabelingWorkflowManagerAction>{
        type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
        labelItemToSelectOrUnselect: inputItemAddSelected
    });
    yield stateAfterSelectedItemAdd;
}

function getInitialState(): LWState {
    const appStateFactory = getAppStateFactory();
    return appStateFactory.next().value;
}

function getStateAfterDataWasInitialized(): LWState {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next(); // move past initial state
    return appStateFactory.next().value;
}

function getStateAfterAddSelectedLabelItem(): LWState {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next(); // move past initial state
    appStateFactory.next(); // move past DataWasInitialized state
    return appStateFactory.next().value;
}

