/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { LCStateType } from "../../connection/Connection";

export const INITIAL_LC_STATE: LCStateType = {
    isInitialized: false,
    isConnecting: false,
    isOpen: false,
    isLocked: false,
    isCompromised: false
}