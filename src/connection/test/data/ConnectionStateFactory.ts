/**
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */
import { Connection} from "../../Connection";
import { ConnectionFactory } from "../../ConnectionFactory";
import { MockMLApiInvoker } from "./MockMLApiInvoker";
import { IMLApiInvoker} from "../../data/MLApiInvoker";
import { ConnectionStateType } from "../../ConnectionStateType";

/**
 * Generator and convenience functions that return desired states required for testing.
 * They are "convenient" because they invoke the appstate factory the appropriate number of times to yield the desired
 * state. The role of the AppState Factory is to centralize all the valid state transitions in a single location.
 */

function* getConnectionStateFactory(): Generator<ConnectionStateType> {
    // Initial State
    let mockMLApiInvoker: IMLApiInvoker = new MockMLApiInvoker();
    let connectionFactory: ConnectionFactory = new ConnectionFactory(mockMLApiInvoker);
    let connection: Connection = connectionFactory.createConnection("testConnection");
    yield connection.StateData; // 1

    // Mimic state transition that occurs on call to Initialize()
    let stateAfterDataWasInitialized = {
        ...connection.StateData,
        IsInitialized: true,
        IsConnecting: false,
        IsOpen: false,
    }
    yield stateAfterDataWasInitialized; // 2

    // Mimic state transition that occurs on call to open
    let stateAfterOpen = {
        ...stateAfterDataWasInitialized,
        IsConnecting: true,
        IsOpen: false
    }
    yield stateAfterOpen; // 3

    // Mimic state transition that that occurs after an open has succeeded
    let stateAfterRecordSuccessfulOpen = {
        ...stateAfterOpen,
        IsConnecting: false,
        IsOpen: true,
        IsLocked: false
    }
    yield stateAfterRecordSuccessfulOpen; // 4

    // Mimic state transition that occurs on call to lock
    let stateAfterLock = {
        ...stateAfterRecordSuccessfulOpen,
        IsLocked: true
    }
    yield stateAfterLock; // 5

    // Mimic state transition that occurs on call to unlock
    let stateAfterUnlock = {
        ...stateAfterLock,
        IsConnecting: false,
        IsOpen: true,
        IsLocked: false
    }
    yield stateAfterUnlock; // 6

    // Mimic state transition that occurs on call to close
    let stateAfterClose = {
        ...stateAfterUnlock,
        IsInitialized: true,
        IsConnecting: false,
        IsOpen: false
    }
    yield stateAfterClose; // 7
}

/**
 * [1] Initial State
 */
export function getInitialState(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    return stateFactory.next().value;
}

/**
 * [2] Mimic: Initialize()
 */
export function getStateAfterDataWasInitialized(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    return stateFactory.next().value;
}

/**
 * [3] Mimic: Open()
 */
export function getStateAfterOpen(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    stateFactory.next();
    return stateFactory.next().value;
}

/**
 * [4] Mimic: RecordSuccessfulOpen()
 */
export function getStateAfterRecordSuccessfulOpen(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    return stateFactory.next().value;
}

/**
 * [5] Mimic: Lock()
 */
export function getStateAfterLock(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    return stateFactory.next().value;
}

/**
 * [6] Mimic: Unlock()
 */
export function getStateAfterUnlock(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    return stateFactory.next().value;
}

/**
 * [7] Mimic: Close()
 */
export function getStateAfterClose(): ConnectionStateType {
    const stateFactory = getConnectionStateFactory();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    stateFactory.next();
    return stateFactory.next().value;
}





