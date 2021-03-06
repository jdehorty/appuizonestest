/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {
    CategoryState,
    CommonLabelState,
    ECClassState,
    ElementState,
    INITIAL_STATE,
    LWState,
    LabelTableEmphasis,
    ModelState,
    PredLabelState,
    TrueLabelState
} from "../state/LWState";
import {LabelingWorkflowManagerAction} from "../definitions/LWActionsDef";
import { Id64Set, Id64String } from "@bentley/bentleyjs-core";
import { MachineLearningColorMode, MachineLearningLabel } from "../../data/LabelTypes";
import { LabelingWorkflowManagerActionType } from "../actionTypes/LWActionTypes";

const MAX_UNDO = 10;

export const LabelingWorkflowManagerReducer = (
    prevState: LWState = INITIAL_STATE,
    action: LabelingWorkflowManagerAction
): LWState => {

     let swapVisibilityStates = () => {
        const newPredLabelStateMap = new Map<MachineLearningLabel, PredLabelState>(prevState.predLabelStateMap);
        const newTrueLabelStateMap = new Map<MachineLearningLabel, TrueLabelState>(prevState.trueLabelStateMap);
        for (const name of prevState.commonLabelStateMap.keys()) {

            if (newPredLabelStateMap.has(name) && newTrueLabelStateMap.has(name)) {

                const trueLabelState = newTrueLabelStateMap.get(name)!;
                const predLabelState = newPredLabelStateMap.get(name)!;
                const newTrueLabelState = {
                    ...trueLabelState,
                    isDisplayed: predLabelState.isDisplayed,
                    isTransparent: predLabelState.isTransparent,
                };
                const newPredLabelState = {
                    ...predLabelState,
                    isDisplayed: trueLabelState.isDisplayed,
                    isTransparent: trueLabelState.isTransparent,
                };
                newTrueLabelStateMap.set(name, newTrueLabelState);
                newPredLabelStateMap.set(name, newPredLabelState);
            }

        }
        return { newPredLabelStateMap, newTrueLabelStateMap };
    };

    switch (action.type) {
        case LabelingWorkflowManagerActionType.DataWasInitialized:
            // Data was initialized, directly set the state maps and raise the ready flag
            return {
                ...prevState,
                ready: true,
                modelStateMap: new Map(action.modelStateMap!),
                categoryStateMap: new Map(action.categoryStateMap!),
                classStateMap: new Map(action.classStateMap!),
                trueLabelStateMap: new Map(action.trueLabelStateMap!),
                predLabelStateMap: new Map(action.predLabelStateMap!),
                commonLabelStateMap: new Map(action.commonLabelStateMap!),
                elementStateMapIsDirty: false,
                elementStateMapHistory: [new Map(action.elementStateMap!)],
                elementStateMapIndex: 0,
            };

        case LabelingWorkflowManagerActionType.LabelsWereSaved:
            // Reset the dirty flag
            return {
                ...prevState,
                elementStateMapIsDirty: false,
            };

        case LabelingWorkflowManagerActionType.AddSelectedLabelItem: {
            // Copy existing selectedUiItems map.
            const newSelectedItems = new Map(prevState.selectedUiItems);
            const item = action.labelItemToSelectOrUnselect;
            newSelectedItems.set(item!.name, item!);
            return {
                ...prevState,
                selectedUiItems: newSelectedItems
            };
        }

        case LabelingWorkflowManagerActionType.ReplaceSelectedLabelItem: {
            // Copy existing selectedItems map.
            const newSelectedItems = new Map(prevState.selectedUiItems);
            const existingItem = prevState.selectedUiItems.get(action.existingLabelItemToReplaceInSelection!.name);
            const item = action.labelItemToSelectOrUnselect;
            newSelectedItems.delete(existingItem!.name);
            newSelectedItems.set(item!.name, item!);
            return {
                ...prevState,
                selectedUiItems: newSelectedItems
            };
        }

        case LabelingWorkflowManagerActionType.RemoveSelectedLabelItem:
            /// Copy existing selectedItems map.
            const newSelectedItems = new Map(prevState.selectedUiItems);
            const existingItem = prevState.selectedUiItems.get(action.labelItemToSelectOrUnselect!.name);
            newSelectedItems.delete(existingItem!.name);
            return {
                ...prevState,
                selectedUiItems: newSelectedItems
            };

        case LabelingWorkflowManagerActionType.ColorModeWasChanged:
            return {
                ...prevState,
                colorMode: action.colorMode!,
            };

        case LabelingWorkflowManagerActionType.ForceShowAllChanged:
            return {
                ...prevState,
                forceShowAll: action.newForceShowAll!,
            };

        case LabelingWorkflowManagerActionType.FilterEmptyRowsChanged:
            return {
                ...prevState,
                filterEmptyRows: action.filterEmptyRows!,
            };

        case LabelingWorkflowManagerActionType.ElementSelectionHasChanged:
            // Selection has changed, store the new set
            return {
                ...prevState,
                selectionSet: action.elementSet!,
            }

        case LabelingWorkflowManagerActionType.ElementLabelsWereChanged: {
            // Element labels were changed, update them and return a new elementStateMap
            if (action.elementSet!.size === 0) {
                // Short circuit of no elements
                return prevState;
            }

            // Clone the current elementStateMap
            const elementStateMap = prevState.elementStateMapHistory[prevState.elementStateMapIndex];
            const newElementStateMap = new Map<Id64String, ElementState>();
            for (const [elementId, elementState] of elementStateMap) {
                newElementStateMap.set(elementId, {...elementState});
            }

            // Change labels accordingly
            for (const id of action.elementSet!) {
                const elementState = newElementStateMap.get(id);
                if (elementState === undefined) {
                    continue;
                }
                elementState.trueLabel = action.label!;
                newElementStateMap.set(id, elementState);
            }

            // Add to history
            const newElementStateMapHistory = prevState.elementStateMapHistory.slice(0, prevState.elementStateMapIndex + 1);
            while (newElementStateMapHistory.length > MAX_UNDO) {
                newElementStateMapHistory.shift();
            }
            newElementStateMapHistory.push(newElementStateMap);
            return {
                ...prevState,
                elementStateMapHistory: newElementStateMapHistory,
                elementStateMapIndex: newElementStateMapHistory.length - 1,
                elementStateMapIsDirty: true,
            };
        }

        case LabelingWorkflowManagerActionType.SelectionLabelWasChanged: {
            // Label of selection was changed, return a new elementStateMap
            if (prevState.selectionSet.size === 0) {
                // Short circuit of no elements
                return {
                    ...prevState,
                    labelClassPoked: action.label!,
                };
            }

            // Clone the current elementStateMap
            const elementStateMap = prevState.elementStateMapHistory[prevState.elementStateMapIndex];
            const newElementStateMap = new Map<Id64String, ElementState>();
            for (const [elementId, elementState] of elementStateMap) {
                newElementStateMap.set(elementId, {...elementState});
            }

            // Change labels accordingly
            for (const id of prevState.selectionSet) {
                const elementState = newElementStateMap.get(id);
                if (elementState === undefined) {
                    continue;
                }
                elementState.trueLabel = action.label!;
                newElementStateMap.set(id, elementState);
            }

            // Add to history
            const newElementStateMapHistory = prevState.elementStateMapHistory.slice(0, prevState.elementStateMapIndex + 1);
            while (newElementStateMapHistory.length > MAX_UNDO) {
                newElementStateMapHistory.shift();
            }
            newElementStateMapHistory.push(newElementStateMap);
            return {
                ...prevState,
                elementStateMapHistory: newElementStateMapHistory,
                elementStateMapIndex: newElementStateMapHistory.length - 1,
                elementStateMapIsDirty: true,
                labelClassPoked: action.label!,
            };
        }

        case LabelingWorkflowManagerActionType.UndoWasRequested: {
            let newIndex = prevState.elementStateMapIndex;
            newIndex -= 1;
            if (newIndex < 0) {
                newIndex = 0;
            }
            return {
                ...prevState,
                elementStateMapIndex: newIndex,
                elementStateMapIsDirty: true,
            };
        }

        case LabelingWorkflowManagerActionType.RedoWasRequested: {
            let newIndex = prevState.elementStateMapIndex;
            newIndex += 1;
            if (newIndex > prevState.elementStateMapHistory.length - 1) {
                newIndex = prevState.elementStateMapHistory.length - 1;
            }
            return {
                ...prevState,
                elementStateMapIndex: newIndex,
                elementStateMapIsDirty: true,
            };
        }

        case LabelingWorkflowManagerActionType.ModelVisibilityWasChanged:
            // Visibility was toggled for one or all models
            const newModelStateMap = new Map<Id64String, ModelState>();
            for (const [modelId, modelState] of prevState.modelStateMap) {
                if (action.elementId === undefined || action.elementId === modelId) {
                    const newModelState = {
                        ...modelState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newModelStateMap.set(modelId, newModelState);
                } else {
                    newModelStateMap.set(modelId, modelState);
                }
            }
            return {
                ...prevState,
                modelStateMap: newModelStateMap,
            }

        case LabelingWorkflowManagerActionType.CategoryVisibilityWasChanged:
            // Visibility was toggled for one or all categories
            const newCategoryStateMap = new Map<Id64String, CategoryState>();
            for (const [categoryId, categoryState] of prevState.categoryStateMap) {
                if (action.elementId === undefined || action.elementId === categoryId) {
                    const newCategoryState = {
                        ...categoryState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newCategoryStateMap.set(categoryId, newCategoryState);
                } else {
                    newCategoryStateMap.set(categoryId, categoryState);
                }
            }
            return {
                ...prevState,
                categoryStateMap: newCategoryStateMap,
            }

        case LabelingWorkflowManagerActionType.ClassVisibilityWasChanged:
            // Visibility was toggled for one or all classes
            const newClassStateMap = new Map<Id64String, ECClassState>();
            for (const [classId, classState] of prevState.classStateMap) {
                if (action.elementId === undefined || action.elementId === classId) {
                    const newClassState = {
                        ...classState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newClassStateMap.set(classId, newClassState);
                } else {
                    newClassStateMap.set(classId, classState);
                }
            }
            return {
                ...prevState,
                classStateMap: newClassStateMap,
            }

        case LabelingWorkflowManagerActionType.PredLabelVisibilityWasChanged:
            // Visibility/transparency was toggled for one or all predictions
            const newPredLabelStateMap = new Map<MachineLearningLabel, PredLabelState>(prevState.predLabelStateMap);
            if (action.label === undefined) {
                // Change state of all labels
                for (const [name, predLabelState] of prevState.predLabelStateMap) {
                    const newPredStateState = {
                        ...predLabelState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newPredLabelStateMap.set(name, newPredStateState);
                }
            } else {
                // Change state of label and children
                const _recurse = (name: MachineLearningLabel) => {
                    const predLabelState = prevState.predLabelStateMap.get(name)!;
                    const newPredStateState = {
                        ...predLabelState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newPredLabelStateMap.set(name, newPredStateState);
                    for (const child of prevState.commonLabelStateMap.get(name)!.childrenLabels) {
                        _recurse(child);
                    }
                }
                _recurse(action.label);
            }
            return {
                ...prevState,
                predLabelStateMap: newPredLabelStateMap,
            }

        case LabelingWorkflowManagerActionType.TrueLabelVisibilityWasChanged:
            // Visibility/transparency was toggled for one or all true labels
            const newTrueLabelStateMap = new Map<MachineLearningLabel, TrueLabelState>(prevState.trueLabelStateMap);
            if (action.label === undefined) {
                // Change state of all labels
                for (const [name, trueLabelState] of prevState.trueLabelStateMap) {
                    const newTrueLabelState = {
                        ...trueLabelState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newTrueLabelStateMap.set(name, newTrueLabelState);
                }
            } else {
                // Change state of label and children
                const _recurse = (name: MachineLearningLabel) => {
                    const trueLabelState = prevState.trueLabelStateMap.get(name)!;
                    const newTrueLabelState = {
                        ...trueLabelState,
                        isDisplayed: action.displayed!,
                        isTransparent: action.transparent!,
                    };
                    newTrueLabelStateMap.set(name, newTrueLabelState);
                    for (const child of prevState.commonLabelStateMap.get(name)!.childrenLabels) {
                        _recurse(child);
                    }
                }
                _recurse(action.label);
            }
            return {
                ...prevState,
                trueLabelStateMap: newTrueLabelStateMap,
            }

        case LabelingWorkflowManagerActionType.LabelColorWasChanged: {
            // Change color for both labels and predictions
            const newCommonLabelStateMap = new Map<MachineLearningLabel, CommonLabelState>();
            for (const [name, labelState] of prevState.commonLabelStateMap) {
                if (name === action.label) {
                    const newLabelState: CommonLabelState = {
                        ...labelState,
                        color: action.newColor!,
                    };
                    newCommonLabelStateMap.set(name, newLabelState);
                } else {
                    newCommonLabelStateMap.set(name, labelState);
                }
            }
            return {
                ...prevState,
                commonLabelStateMap: newCommonLabelStateMap,
            }
        }

        case LabelingWorkflowManagerActionType.LabelExpandStateWasChanged: {
            // Change expand state for both labels and predictions
            const newCommonLabelStateMap = new Map<MachineLearningLabel, CommonLabelState>();
            for (const [name, labelState] of prevState.commonLabelStateMap) {
                if (name === action.label) {
                    const newLabelState: CommonLabelState = {
                        ...labelState,
                        isExpanded: action.newExpanded!,
                    };
                    newCommonLabelStateMap.set(name, newLabelState);
                } else {
                    newCommonLabelStateMap.set(name, labelState);
                }
            }
            return {
                ...prevState,
                commonLabelStateMap: newCommonLabelStateMap,
            }
        }

        case LabelingWorkflowManagerActionType.CycleModeActionStarted: {
            return {
                ...prevState,
                cycleModeState: {
                    ...prevState.cycleModeState,
                    working: false,
                }
            }
        }
        case LabelingWorkflowManagerActionType.CycleModeWasEnabled: {
            return {
                ...prevState,
                cycleModeState: {
                    ...prevState.cycleModeState,
                    enabled: true,
                    working: false,
                    cycleList: action.cycleList!,
                    currentIndex: undefined,
                    initialFrustums: action.initialFrustums!,
                }
            }
        }
        case LabelingWorkflowManagerActionType.CycleModeWasDisabled: {
            return {
                ...prevState,
                cycleModeState: {
                    ...prevState.cycleModeState,
                    enabled: false,
                    working: false,
                }
            }
        }
        case LabelingWorkflowManagerActionType.CycleModeIndexWasChanged: {
            return {
                ...prevState,
                cycleModeState: {
                    ...prevState.cycleModeState,
                    currentIndex: action.newIndex!,
                }
            }
        }

        case LabelingWorkflowManagerActionType.VisibilityStateWasSwapped: {
            const { newPredLabelStateMap, newTrueLabelStateMap } = swapVisibilityStates();
            return {
                ...prevState,
                predLabelStateMap: newPredLabelStateMap,
                trueLabelStateMap: newTrueLabelStateMap,
            }
        }

        case LabelingWorkflowManagerActionType.ToggleLabelTableEmphasis: {
            let newLableTableState: LabelTableEmphasis = (prevState.labelTableEmphasis == LabelTableEmphasis.ActOnLabels)
                ? LabelTableEmphasis.ActOnPredictions : LabelTableEmphasis.ActOnLabels;

            const { newPredLabelStateMap, newTrueLabelStateMap } = swapVisibilityStates();

            return {
                ...prevState,
                labelTableEmphasis: newLableTableState,
                predLabelStateMap: newPredLabelStateMap,
                trueLabelStateMap: newTrueLabelStateMap,
            }
        }

        case LabelingWorkflowManagerActionType.ClearSelectedUiItems: {
            const clearedItems = new Map(prevState.selectedUiItems);
            clearedItems?.clear();
            return {
                ...prevState,
                selectedUiItems: clearedItems
            }
        }

        default:
            return prevState;
    }
};

