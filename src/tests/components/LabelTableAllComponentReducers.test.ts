/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {LabelingWorkflowManagerReducer as reducer} from "../../store/LabelingWorkflowReducer";
import {
    LabelingWorkflowManagerAction,
    LabelingWorkflowManagerActionType
} from "../../store/LabelingWorkflowActionsTypes";
import {
    BaseGroupState,
    CommonLabelState,
    ECClassState,
    ElementState,
    INITIAL_STATE,
    LabelTableEmphasis,
    PredLabelState,
    TrueLabelState
} from "../../store/LabelingWorkflowState";

describe('LabelTableAllComponent Reducers', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, <LabelingWorkflowManagerAction>{})).toEqual(INITIAL_STATE)
    })

    test('DataWasInitialized', () => {
        expect(reducer(INITIAL_STATE, <LabelingWorkflowManagerAction>{
            type: LabelingWorkflowManagerActionType.DataWasInitialized,
        }))
            .toEqual({
                ...INITIAL_STATE,
                ready: true
            })
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

// let state = {
//     categoryStateMap: new Map<Id64String, BaseGroupState>(),
//     classStateMap: new Map<Id64String, ECClassState>(),
//     colorMode: MachineLearningColorMode.Native,
//     commonLabelStateMap: new Map<MachineLearningLabel, CommonLabelState>(),
//     cycleModeState: {
//         working: false,
//         enabled: false
//     },
//     elementStateMapHistory: [new Map<Id64String, ElementState>()],
//     elementStateMapIndex: 0,
//     elementStateMapIsDirty: false,
//     filterEmptyRows: false,
//     forceShowAll: false,
//     labelTableEmphasis: LabelTableEmphasis.ActOnLabels,
//     modelStateMap: new Map<Id64String, BaseGroupState>(),
//     predLabelStateMap: new Map<MachineLearningLabel, PredLabelState>(),
//     ready: true,
//     selectedUiItems: new Map<MachineLearningLabel, MLStateTableDataItem>(),
//     selectionSet: new Set<Id64String>(),
//     trueLabelStateMap: new Map<MachineLearningLabel, TrueLabelState>(),
// }