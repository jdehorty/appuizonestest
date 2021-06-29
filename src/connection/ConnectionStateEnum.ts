/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */


/**
 * Enum of different states for a connection
 */
export enum ConnectionStateName {
    Initialized = "Initialized",
    Connecting = "Connecting",
    Open = "Open",
    Locked = "Locked",
    Null = "Null",
    Compromised = "Compromised"
}