/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import {LabelingWorkflowManagerReducer as reducer} from "../../store/LabelingWorkflowReducer";
import {
    LabelingWorkflowManagerAction,
    LabelingWorkflowManagerActionType
} from "../../store/LabelingWorkflowActionsTypes";
import {INITIAL_STATE} from "../../store/LabelingWorkflowState";
import {ColorDef} from "@bentley/imodeljs-common";
import {MachineLearningColorMode} from "../../data/LabelTypes";

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
        const before = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: true
        }
        const after = {
            ...stateAfterDataWasInitialized,
            elementStateMapIsDirty: false
        }

        expect(reducer(before, <LabelingWorkflowManagerAction>{
            type: LabelingWorkflowManagerActionType.LabelsWereSaved,
        }))
            .toEqual(after)
    });

    test('AddSelectedLabelItem', () => {
        const inputItem = {
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
            reducer(stateAfterDataWasInitialized, <LabelingWorkflowManagerAction>{
                type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
                labelItemToSelectOrUnselect: inputItem
            });

        // stringify the selectedUiItems Map in the received object for comparison with its expected value
        const receivedJson = JSON.stringify([...receivedMap.selectedUiItems]);
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

        expect(reducer(before, <LabelingWorkflowManagerAction>{
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

        expect(reducer(before, <LabelingWorkflowManagerAction>{
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: MachineLearningColorMode.PredictionColors,
        }))
            .toEqual(after)
    });
});