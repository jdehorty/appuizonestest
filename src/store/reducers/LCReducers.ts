/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { SelectionExtenderAction } from "../definitions/SEActionsDef"
import { LCType } from "../types/LCTypes";
import { LabelingConnectionActionType } from "../actionTypes/LCActionTypes";
import {INITIAL_LC_STATE} from "../state/LCState";


export const ConnectionStateReducer = (prevState: LCType = INITIAL_LC_STATE, action: SelectionExtenderAction): LCType => {
    switch (action.type) {
        case LabelingConnectionActionType.Initialized:
            return {
                ...prevState,
                isInitialized: true,
            };
        case LabelingConnectionActionType.Connecting:
            return {
                ...prevState,
                isConnecting: true,
            };
        case LabelingConnectionActionType.NotConnecting:
            return {
                ...prevState,
                isConnecting: false,
            };
        case LabelingConnectionActionType.Open:
            return {
                ...prevState,
                isOpen: true,
                isClosed: false,
            };
        case LabelingConnectionActionType.Closed:
            return {
                ...prevState,
                isOpen: false,
                isClosed: true,
            };
        case LabelingConnectionActionType.Locked:
            return {
                ...prevState,
                isLocked: true,
            };
        case LabelingConnectionActionType.NotLocked:
            return {
                ...prevState,
                isLocked: false,
            };
        case LabelingConnectionActionType.Compromised:
            return {
                ...prevState,
                isCompromised: true
            };
        case LabelingConnectionActionType.NotCompromised:
            return {
                ...prevState,
                isCompromised: false
            };
        default:
            return prevState;
    }
};
