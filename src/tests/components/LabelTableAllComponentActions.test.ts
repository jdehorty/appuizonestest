/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import * as actions from "../../store/actions/LabelTableAllComponentActions";
import {ColorDef} from "@bentley/imodeljs-common";
import {MachineLearningColorMode} from "../../data/LabelTypes";
import { LabelingWorkflowManagerActionType } from "../../store/actionTypes/LWActionTypes";
import { MLStateTableDataItem } from "../../store/types/LWTypes";

describe('LabelTableAllComponent Actions', () => {
    let item = <MLStateTableDataItem>{
        name: "Beam",
        color: ColorDef.blue,
        hasData: true,
        isSelected: true,
        trueLabelIsDisplayed: true,
        trueLabelIsTransparent: false,
        trueLabelTotalCount: 10,
        trueLabelVisibleCount: 5,
        trueLabelSelectedCount: 10,
        predLabelIsDisplayed: true,
        predLabelIsTransparent: false,
        predLabelTotalCount: 10,
        predLabelVisibleCount: 7,
        predLabelSelectedCount: 10,
    }

    test('LabelExpandStateChange', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.LabelExpandStateWasChanged,
            newExpanded: true,
            label: "Beam",
        }
        expect(actions.LabelExpandStateChange(
            true,
            "Beam")).toEqual(expectedAction);
    })

    test('LabelColorChange', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.LabelColorWasChanged,
            newColor: ColorDef.blue,
            label: "Column",
        }
        expect(actions.LabelColorChange(
            ColorDef.blue,
            "Column")).toEqual(expectedAction);
    });

    test('LabelDisplayChange', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged,
            label: "Pipe",
            displayed: true,
            transparent: true,
        }
        expect(actions.LabelDisplayChange(
            "Pipe",
            true,
            true)).toEqual(expectedAction);
    });

    test('PredictionDisplayChange', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged,
            label: "Pipe",
            displayed: true,
            transparent: false
        }
        expect(actions.PredictionDisplayChange(
            "Pipe",
            true,
            false)).toEqual(expectedAction);
    });

    test('LabelApply', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.SelectionLabelWasChanged,
            label: "Pipe",
        }
        expect(actions.LabelApply(
            "Pipe")).toEqual(expectedAction);
    });

    test('Undo', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.UndoWasRequested,
        }
        expect(actions.Undo()).toEqual(expectedAction);
    });

    test('Redo', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.RedoWasRequested,
        }
        expect(actions.Redo()).toEqual(expectedAction);
    })

    test('ChangeColorMode', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.ColorModeWasChanged,
            colorMode: MachineLearningColorMode.LabelColors,
        }
        expect(actions.ChangeColorMode(
            MachineLearningColorMode.LabelColors,
        )).toEqual(expectedAction);
    });

    test('SwapTruePredDisplay', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.VisibilityStateWasSwapped,
        }
        expect(actions.SwapTruePredDisplay()).toEqual(expectedAction);
    });

    test('FilterEmptyRowsChange', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.FilterEmptyRowsChanged,
            filterEmptyRows: false
        }
        expect(actions.FilterEmptyRowsChange(
            false,
        )).toEqual(expectedAction);
    });

    test('AddSelectedLabelItem', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.AddSelectedLabelItem,
            labelItemToSelectOrUnselect: item
        }
        expect(actions.AddSelectedLabelItem(
            item,
        )).toEqual(expectedAction);
    });

    test('RemoveSelectedLabelItem', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.RemoveSelectedLabelItem,
            labelItemToSelectOrUnselect: item
        }
        expect(actions.RemoveSelectedLabelItem(
            item,
        )).toEqual(expectedAction);
    });

    test('ReplaceSelectedLabelItem', () => {
        const newItem = {...item, isSelected: false}
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.ReplaceSelectedLabelItem,
            labelItemToSelectOrUnselect: newItem,
            existingLabelItemToReplaceInSelection: item
        }
        expect(actions.ReplaceSelectedLabelItem(
            newItem,
            item,
        )).toEqual(expectedAction);
    });

    test('ToggleLabelTableEmphasis', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis
        }
        expect(actions.ToggleLabelTableEmphasis()).toEqual(expectedAction);
    });

    test('ClearSelectedUiItems', () => {
        const expectedAction = {
            type: LabelingWorkflowManagerActionType.ClearSelectedUiItems
        }
        expect(actions.ClearSelectedUiItems()).toEqual(expectedAction);
    });

})

