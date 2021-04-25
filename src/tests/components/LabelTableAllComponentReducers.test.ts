/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {LabelingWorkflowManagerReducer as reducer} from "../../store/LabelingWorkflowReducer";
import {
    LabelingWorkflowManagerAction,
    LabelingWorkflowManagerActionType
} from "../../store/LabelingWorkflowActionsTypes";
import {INITIAL_STATE} from "../../store/LabelingWorkflowState";

describe('LabelTableAllComponent Reducers', () => {

    let stateAfterDataWasInitialized = {
        ...INITIAL_STATE,
        ready: true
    }

    it('should return initial state', () => {
        expect(reducer(undefined, <LabelingWorkflowManagerAction>{})).toEqual(INITIAL_STATE)
    });

    test('DataWasInitialized', () => {
        expect(reducer(INITIAL_STATE, <LabelingWorkflowManagerAction>{
            type: LabelingWorkflowManagerActionType.DataWasInitialized,
            ready: false
        }))
            .toEqual(stateAfterDataWasInitialized)
    });

    test('LabelsWereSaved', () => {
        const prevState = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirtytruefalse: true
        }
        const newState = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirtytruefalse: false
        }

        expect(reducer(prevState, <LabelingWorkflowManagerAction>{
            type: LabelingWorkflowManagerActionType.LabelsWereSaved,
        }))
            .toEqual(newState)
    });

    test('AddSelectedLabelItem', () => {
        const item = {
            name: 'MachineLearning:label.beam',
            color: 4210752,
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
            predLabelSelectedCount: 0,
        }

        // expect(reducer(stateAfterDataWasInitialized, <LabelingWorkflowManagerAction>{
        //     type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
        //     labelItemToSelectOrUnselect: item
        // }))
        //     .toEqual({
        //         ...INITIAL_STATE,
        //         name: 'MachineLearning:label.beam',
        //         color: 4210752,
        //         isSelected: true,
        //         hasData: true,
        //         trueLabelIsDisplayed: true,
        //         trueLabelIsTransparent: true,
        //         trueLabelTotalCount: 0,
        //         trueLabelVisibleCount: 0,
        //         trueLabelSelectedCount: 0,
        //         predLabelIsDisplayed: true,
        //         predLabelIsTransparent: false,
        //         predLabelTotalCount: 52,
        //         predLabelVisibleCount: 52,
        //         predLabelSelectedCount: 0,
        //     })
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