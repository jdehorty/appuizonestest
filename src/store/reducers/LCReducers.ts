/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { SelectionExtenderAction } from "../definitions/SEActionsDef"
import { LCStateType } from "../types/LCTypes";
import { LabelingConnectionActionType } from "../actionTypes/LCActionTypes";
import { INITIAL_LC_STATE } from "../state/LCState";


export const LabelingConnectionStateReducer = (prevState: LCStateType = INITIAL_LC_STATE, action: SelectionExtenderAction): LCStateType => {
    switch (action.type) {
        case LabelingConnectionActionType.Initialize:
            return {
                ...prevState,
                isInitialized: true,
            };
        case LabelingConnectionActionType.Open:
            return {
                ...prevState,
                isConnecting: true,
                isOpen: false,
            };
        case LabelingConnectionActionType.RecordSuccessfulOpen:
            return {
                ...prevState,
                isConnecting: false,
                isOpen: true
            };
        case LabelingConnectionActionType.Close:
            return {
                ...prevState,
                isInitialized: true,
                isConnecting: false,
                isOpen: false
            };
        case LabelingConnectionActionType.Lock:
            return {
                ...prevState,
                isLocked: true,
            };
        case LabelingConnectionActionType.Unlock:
            return {
                ...prevState,
                isConnecting: false,
                isOpen: true,
                isLocked: false
            };
        default:
            return prevState;
    }
};
