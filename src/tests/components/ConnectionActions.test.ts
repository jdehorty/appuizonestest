/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

// import { LabelingWorkflowManagerActionType } from "../../store/actionTypes/LCctionTypes";
// import { LabelingWorkflowManagerActionTypes } from "../../store/actionTypes/LWActionTypes";
import { LabelingConnectionActionType } from "../../store/actionTypes/LCActionTypes";
import * as actions from "../../store/actions/ConnectionActions";

describe('LabelTableAllComponent Actions', () => {

    test('LabelExpandStateChange', () => {
        const expectedAction = {
            type: LabelingConnectionActionType.Initialize,
            newExpanded: true,
            label: "Beam",
        }
        expect(actions.Initialize().toEqual(expectedAction);
    })
})

