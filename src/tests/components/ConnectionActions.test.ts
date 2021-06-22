/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

// import { LabelingWorkflowManagerActionType } from "../../store/actionTypes/LCctionTypes";
// import { LabelingWorkflowManagerActionTypes } from "../../store/actionTypes/LWActionTypes";
import { LabelingConnectionActionType } from "../../store/actionTypes/LCActionTypes";
import * as actions from "../../store/actions/ConnectionActions";

describe('Labeling Connection Actions', () => {

    test('Initialize', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Initialize,
            isInitialized: true
        }
        expect(actions.Initialize()).toEqual(expectedAction);
    })

    test('Open', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Open,
            isConnecting: true,
            isOpen: false
        }
        expect(actions.Open()).toEqual(expectedAction);
    });

    test('RecordSuccessfulOpen', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.RecordSuccessfulOpen,
            isConnecting: false,
            isOpen: true,
            isLocked: false
        }
        expect(actions.RecordSuccessfulOpen()).toEqual(expectedAction);
    });

    test('Lock', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Lock,
            isLocked: true
        }
        expect(actions.Lock()).toEqual(expectedAction);
    });

    test('Unlock', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Unlock,
            isConnecting: false,
            isOpen: true,
            isLocked: false
        }
        expect(actions.Unlock()).toEqual(expectedAction);
    });

    test('Close', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Close,
            isInitialized: true,
            isConnecting: false,
            isOpen: false
        }
        expect(actions.Close()).toEqual(expectedAction);
    });

})

