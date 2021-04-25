/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

// import {LabelingWorkflowManagerReducer} from "../../store/LabelingWorkflowReducer";
// import {LabelingWorkflowManagerAction as actions} from "../../store/LabelingWorkflowActionsTypes";
import {
    LabelingWorkflowManagerAction,
    LabelingWorkflowManagerActionType
} from "../../store/LabelingWorkflowActionsTypes";
import {INITIAL_STATE, LabelingWorkflowState} from "../../store/LabelingWorkflowState";


import {LabelingWorkflowManagerReducer as reducer} from "../../store/LabelingWorkflowReducer";


describe('LabelTableAllComponent Reducers', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, <LabelingWorkflowManagerAction>{})).toEqual(INITIAL_STATE)
    })

    it('should handle ColorModeWasChanged', () => {

        const prevState = INITIAL_STATE;

        expect(
            reducer(prevState, <LabelingWorkflowManagerAction>{
                // ...prevState,
                // colorMode: action.colorMode!
            },)
        )
    });

})


// format
// it('should handle ADD_TODO', () => {
//     expect(
//         reducer([], {
//             type: types.ADD_TODO,
//             text: 'Run the tests'
//         })
//     ).toEqual([
//         {
//             text: 'Run the tests',
//             completed: false,
//             id: 0
//         }
//     ])