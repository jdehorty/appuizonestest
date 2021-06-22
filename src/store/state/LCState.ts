/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { LCType } from "../types/LCTypes";

export const INITIAL_LC_STATE: LCType = {
    isInitialized: false,
    isConnecting: false,
    isOpen: false,
    isLocked: false,
    isClosed: true,
    isCompromised: false
}