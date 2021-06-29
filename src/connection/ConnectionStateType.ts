/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * Type for a connection state
 */

export type ConnectionStateType = {
    IsInitialized: boolean;
    IsConnecting: boolean;
    IsOpen: boolean;
    IsLocked: boolean;
    IsCompromised: boolean;
}