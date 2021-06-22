/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { SelectionExtenderState } from "../state/SEState";
import { SelectionExtenderAction } from "../definitions/SEActionsDef"
import { SelectionExtenderConfig, SEStateType } from "../types/SETypes";
import { SelectionExtenderActionType } from "../actionTypes/SEActionTypes";


export const SelectionExtenderReducer = (prevState: SEStateType = SelectionExtenderState, action: SelectionExtenderAction): SEStateType => {
    switch (action.type) {
        case SelectionExtenderActionType.SINGLE_KEY_HAS_CHANGED:
            return {
                ...prevState,
                singleKey: action.newSingleKey!,
                contentMap: action.newContentMap!,
            };
        case SelectionExtenderActionType.CONFIG_WAS_CHANGED:
            // Create a deep-ish copy of the config
            const configCopy: SelectionExtenderConfig = {
                ...action.newConfig!,
                rule: {
                    ...action.newConfig!.rule,
                    childRules: Array.from(action.newConfig!.rule.childRules),
                }
            }
            return {...prevState, config: configCopy};
        case SelectionExtenderActionType.SEARCH_HAS_STARTED:
            return {
                ...prevState,
                isSearching: true,
            };
        case SelectionExtenderActionType.ELEMENTS_WERE_FOUND:
            return {
                ...prevState,
                isSearching: false,
                foundCount: action.newFoundCount,
            };
        default:
            return prevState;
    }
};
