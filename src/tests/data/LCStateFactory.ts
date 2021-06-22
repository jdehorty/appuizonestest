/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { INITIAL_LC_STATE } from "../../store/state/LCState";
import { LCStateType } from "../../store/types/LCTypes";

function* getAppStateFactory(): Generator<LCStateType> {
    // Initial State
    yield INITIAL_LC_STATE; // 1

    // Action: Initialize
    let stateAfterDataWasInitialized = {
        ...INITIAL_LC_STATE,
        isInitialized: true,
        isConnecting: false,
        isOpen: false,
    }
    yield stateAfterDataWasInitialized; // 2

    // Action: Open
    let stateAfterOpen = {
        ...INITIAL_LC_STATE,
        isConnecting: true,
        isOpen: false
    }
    yield stateAfterOpen; // 3

    // Action: RecordSuccessfulOpen
    let stateAfterRecordSuccessfulOpen = {
        ...INITIAL_LC_STATE,
        isConnecting: true,
        isOpen: false
    }
    yield stateAfterRecordSuccessfulOpen; // 4

    // Action: Lock
    let stateAfterLock = {
        ...INITIAL_LC_STATE,
        isLocked: true
    }
    yield stateAfterLock; // 5

    // Action: Unlock
    let stateAfterUnlock = {
        ...INITIAL_LC_STATE,
        isConnecting: false,
        isOpen: true,
        isLocked: false
    }
    yield stateAfterUnlock; // 6

    // Action: Close
    let stateAfterClose = {
        ...INITIAL_LC_STATE,
        isInitialized: true,
        isConnecting: false,
        isOpen: false
    }
    yield stateAfterClose; // 7
}

// Convenience functions that return desired states required for testing
// They are "convenient" because they invoke the appstate factory the appropriate number of times
// to yield the desired state. The role of the AppState Factory is to centralize all the valid
// state transitions in a single place so that we don't have to copy/paste it into all the different
// tests.

/**
 * [1] Initial State
 */
export function getInitialState(): LCStateType {
    const appStateFactory = getAppStateFactory();
    return appStateFactory.next().value;
}

/**
 * [2] Action: Initialize
 */
export function getStateAfterDataWasInitialized(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    return appStateFactory.next().value;
}

/**
 * [3] Action: Open
 */
export function getStateAfterOpen(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    appStateFactory.next();
    return appStateFactory.next().value;
}

/**
 * [4] Action: RecordSuccessfulOpen
 */
export function getStateAfterRecordSuccessfulOpen(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    return appStateFactory.next().value;
}

/**
 * [5] Action: Lock
 */
export function getStateAfterLock(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    return appStateFactory.next().value;
}

/**
 * [6] Action: Unlock
 */
export function getStateAfterUnlock(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    return appStateFactory.next().value;
}

/**
 * [7] Action: Close
 */
export function getStateAfterClose(): LCStateType {
    const appStateFactory = getAppStateFactory();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    appStateFactory.next();
    return appStateFactory.next().value;
}





