/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ColorDef } from "@bentley/imodeljs-common";
import { MachineLearningColorMode } from "../../data/LabelTypes";
import { INITIAL_STATE } from "../../store/state/LWState";
import { LabelingWorkflowManagerAction as action } from "../../store/definitions/LWActionsDef";
import { LabelingWorkflowManagerActionType } from "../../store/actionTypes/LWActionTypes";
import { LabelingWorkflowManagerReducer as reducer } from "../../store/reducers/LWReducers";

describe('Labeling Workflow Reducers', () => {

    let stateAfterDataWasInitialized = {
        ...INITIAL_STATE,
        ready: true
    }

    it('should return initial state', () => {
        expect(reducer(undefined, <action>{})).toEqual(INITIAL_STATE)
    });

    test('DataWasInitialized', () => {
        expect(reducer(INITIAL_STATE, <action>{
            type: LabelingWorkflowManagerActionType.DataWasInitialized,
            ready: false
        }))
            .toEqual(stateAfterDataWasInitialized)
    });

    test('LabelsWereSaved', () => {
        const before = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: true
        }
        const after = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: false
        }

        expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.LabelsWereSaved,
        }))
            .toEqual(after)
    });


    test('AddSelectedLabelItem', () => {
        let inputItem = {
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

        const receivedMap =
            reducer(stateAfterDataWasInitialized, <action>{
                type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
                labelItemToSelectOrUnselect: inputItem
            });

        // stringify the selectedUiItems Map in the received object for comparison with its expected value
        let receivedJson = JSON.stringify([...receivedMap.selectedUiItems]);
        const expectedJson = JSON.stringify([[
            "MachineLearning:label.beam",
            {
                "name": "MachineLearning:label.beam",
                "color": ColorDef.blue,
                "isSelected": true,
                "hasData": true,
                "trueLabelIsDisplayed": true,
                "trueLabelIsTransparent": true,
                "trueLabelTotalCount": 0,
                "trueLabelVisibleCount": 0,
                "trueLabelSelectedCount": 0,
                "predLabelIsDisplayed": true,
                "predLabelIsTransparent": false,
                "predLabelTotalCount": 52,
                "predLabelVisibleCount": 52,
                "predLabelSelectedCount": 0
            }]]
        );
        expect(receivedJson).toEqual(expectedJson)
    });

    test('ColorModeWasChanged: LabelColors', () => {
        const before = {
            ...stateAfterDataWasInitialized,
            colorMode: MachineLearningColorMode.Native
        }
        const after = {
            ...stateAfterDataWasInitialized,
            colorMode: MachineLearningColorMode.LabelColors
        }

        expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: MachineLearningColorMode.LabelColors,
        }))
            .toEqual(after)
    });

    test('ColorModeWasChanged: PredictionColors', () => {
        const before = {
            ...stateAfterDataWasInitialized,
            colorMode: MachineLearningColorMode.Native
        }
        const after = {
            ...stateAfterDataWasInitialized,
            colorMode: MachineLearningColorMode.PredictionColors
        }

        expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: MachineLearningColorMode.PredictionColors,
        }))
            .toEqual(after)
    });

    test('LabelTableEmphasis toggle should cause pred-true flip-flop', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            label: "MachineLearning:label.beam",
            displayI18nKey: "MachineLearning:label.beam",
            isDisplayed: true,
            isTransparent: true,
        };

        let expected = {
            ...stateAfterDataWasInitialized,
            label: "MachineLearning:label.beam",
            displayI18nKey: "MachineLearning:label.beam",
            isDisplayed: true,
            isTransparent: true,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.VisibilityStateWasSwapped
        }))

        received.toEqual(expected);
    });

    test('SelectionLabelWasChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            labelingWorkflowManagerState: {
                ready: true,
                elementStateMapIsDirty: true,
                elementStateMapIndex: 3,
                forceShowAll: false,
                labelClassPoked: undefined,
                filterEmptyRows: false,
                labelTableEmphasis: 0,
            }
        }
        let expected = {
            ...stateAfterDataWasInitialized,
            labelingWorkflowManagerState: {
                ready: true,
                elementStateMapIsDirty: true,
                elementStateMapIndex: 3,
                forceShowAll: false,
                labelClassPoked: undefined,
                filterEmptyRows: false,
                labelTableEmphasis: 0,
            }
        }
        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged
        }))
        received.toEqual(expected)
    });

    it('UndoWasRequested', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: false,
            elementStateMapIndex: 2
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: true,
            elementStateMapIndex: 1
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.UndoWasRequested,
        }))

        received.toEqual(expected)
    });

    it('RedoWasRequested', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: false,
            elementStateMapIndex: 4
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: true,
            elementStateMapIndex: 0
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.RedoWasRequested,
        }))

        received.toEqual(expected)
    });

    it('LabelColorWasNotChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            "elementStateMapIsDirty": false,
            newColor: 255
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            newColor: 255
        }
        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
        }))
        received.toEqual(expected)
    });

    test('LabelTableEmphasis', () => {

        let before = {
            ...stateAfterDataWasInitialized,
            labelTableEmphasis: 0,
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            labelTableEmphasis: 1,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis,
        }))

        received.toEqual(expected)
    });

    test('CycleModeActionStarted', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                working: false,
            }
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                working: false,
            }
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CycleModeActionStarted,
        }))
        received.toEqual(expected)
    });

    it('ClearSelectedUiItems', () => {
        let before = {
            ...stateAfterDataWasInitialized,
        }

        let expected = {
            ...stateAfterDataWasInitialized,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ClearSelectedUiItems,
        }))

        received.toEqual(expected)

    });

    it('CycleModeIndexWasChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
            }
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
            }
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CycleModeIndexWasChanged,
        }))

        received.toEqual(expected)
    });

    test('CycleModeWasDisabled', () => {

        let before = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                enabled: false,
                working: false,
            }
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                enabled: false,
                working: false,
            }
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CycleModeWasDisabled,
        }))

        received.toEqual(expected)

    });

    it('VisibilityStateWasSwapped', () => {
        let before = {
            ...stateAfterDataWasInitialized,
        }
        let expected = {
            ...stateAfterDataWasInitialized,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.VisibilityStateWasSwapped,
        }))

        received.toEqual(expected)

    });

    it('TrueLabelVisibilityWasChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            isDisplayed: true,
            isTransparent: false
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            isDisplayed: true,
            isTransparent: false
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
        }))

        received.toEqual(expected)
    });


    it('LabelExpandStateWasChanged', () => {

        let before = {
            ...stateAfterDataWasInitialized
        }

        let expected = {
            ...stateAfterDataWasInitialized
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
        }))

        received.toEqual(expected)
    });

    test('CycleModeWasDisabled', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                enabled: true,
                working: true,
                currentIndex: undefined,
            }
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                enabled: false,
                working: false,
                currentIndex: undefined,
            }
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CycleModeWasDisabled,
        }))

        received.toEqual(expected)
    });

    test('CycleModeWasEnabled', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                cycleList: undefined,
                enabled: false,
                working: false,
                currentIndex: undefined,
                initialFrustums: undefined
            }
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            cycleModeState: {
                ...stateAfterDataWasInitialized.cycleModeState,
                cycleList: undefined,
                enabled: true,
                working: false,
                currentIndex: undefined,
                initialFrustums: undefined
            }
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CycleModeWasEnabled,
        }))

        received.toEqual(expected)
    });

    test('ClassVisibilityWasChanged', () => {

        let before = {
            ...stateAfterDataWasInitialized
        }

        let expected = {
            ...stateAfterDataWasInitialized
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ClassVisibilityWasChanged,
        }))

        received.toEqual(expected)

    });

    test('PredLabelVisibilityWasChanged', () => {

        let before = {
            ...stateAfterDataWasInitialized,
            isDisplayed: true,
            isTransparent: false
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            isDisplayed: true,
            isTransparent: false
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
        }))

        received.toEqual(expected)
    });

    test('CategoryVisibilityWasChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
        }

        let expected = {
            ...stateAfterDataWasInitialized,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.CategoryVisibilityWasChanged,
        }))

        received.toEqual(expected)

    });

    test('ForceShowAllChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            forceShowAll: false,
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            forceShowAll: undefined,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ForceShowAllChanged,
        }))

        received.toEqual(expected)

    });

    test('FilterEmptyRowsChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
            filterEmptyRows: false
        }

        let expected = {
            ...stateAfterDataWasInitialized,
            filterEmptyRows: undefined
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.FilterEmptyRowsChanged,
        }))

        received.toEqual(expected)

    });

    test('ModelVisibilityWasChanged', () => {
        let before = {
            ...stateAfterDataWasInitialized,
        }

        let expected = {
            ...stateAfterDataWasInitialized,
        }

        let received = expect(reducer(before, <action>{
            type: LabelingWorkflowManagerActionType.ModelVisibilityWasChanged,
        }))

        received.toEqual(expected)
    });

})
;