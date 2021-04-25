import * as actions from "../../store/LabelingWorkflowActionsTypes"
import {LabelingWorkflowManagerActionType} from "../../store/LabelingWorkflowActionsTypes"

import {LabelingWorkflowManagerReducer} from "../../store/LabelingWorkflowReducer";

describe('ClearSelection', () => {
    it('should create an action to clear the selection set', () => {
        const expectedAction = "LabelingWorkflowManagerActionType.ClearSelection";
        expect(actions.LabelingWorkflowManagerActionType.ClearSelection).toEqual(expectedAction)
    })

    it('should return the initial state', () => {
        let labelingWorkflowManagerState = {
            ready: false,
            modelStateMap: {},
            categoryStateMap: {},
            classStateMap: {},
            trueLabelStateMap: {},
            predLabelStateMap: {},
            commonLabelStateMap: {},
            elementStateMapIsDirty: false,
            elementStateMapHistory: [
                {}
            ],
            elementStateMapIndex: 0,
            selectionSet: {},
            cycleModeState: {
                working: false,
                enabled: false
            },
            colorMode: 'MachineLearning:colorMode.native',
            forceShowAll: false,
            filterEmptyRows: false,
            selectedUiItems: {},
            labelTableEmphasis: 0
        }

        const resultingStateFromClearSelection = LabelingWorkflowManagerReducer(undefined, {type: LabelingWorkflowManagerActionType.ClearSelection});
        expect(resultingStateFromClearSelection).toMatchObject(labelingWorkflowManagerState);
    })
})

