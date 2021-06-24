/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

export enum ConnectionStateName {
    Initialized = "Initialized",
    Connecting = "Connecting",
    Open = "Open",
    Locked = "Locked",
    Null = "Null",
    Compromised = "Compromised"
}