/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { LabelingConnectionActionType } from "../actionTypes/LCActionTypes";

// State Diagram: https://bit.ly/3gRYKfP

export const Initialize = () => ({
    type: LabelingConnectionActionType.Initialize,
    isInitialized: true
});

export const Open = () => ({
    type: LabelingConnectionActionType.Open,
    isConnecting: true,
    isOpen: false
});

export const Close = () => ({
    type: LabelingConnectionActionType.Close,
    isInitialized: true,
    isConnecting: false,
    isOpen: false
 });

export const RecordSuccessfulOpen = () => ({
    type: LabelingConnectionActionType.RecordSuccessfulOpen,
    isConnecting: false,
    isOpen: true,
    isLocked: false
})

export const Lock = () => ({
    type: LabelingConnectionActionType.Lock,
    isLocked: true
})

export const Unlock = () => ({
    type: LabelingConnectionActionType.Unlock,
    isConnecting: false,
    isOpen: true,
    isLocked: false
})

