/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {
    getInitialState,
    getStateAfterClose,
    getStateAfterDataWasInitialized,
    getStateAfterLock,
    getStateAfterOpen,
    getStateAfterRecordSuccessfulOpen,
    getStateAfterUnlock
} from "./data/ConnectionStateFactory";
import { MockMLApiInvoker } from "./data/MockMLApiInvoker";
import { ConnectionFactory } from "../ConnectionFactory";

describe('Labeling Connection State Transitions', () => {

    let mockMLApiInvoker = new MockMLApiInvoker();
    let connectionFactory = new ConnectionFactory(mockMLApiInvoker);
    let connection = connectionFactory.createConnection("testConnection");

    test('InitialState', () => {
        // Initial (uninitialized) State
        let expected = getInitialState();
        let actual = expect(connection.StateData);
        actual.toEqual(expected);
    });

    test('StateAfterDataWasInitialized', () =>{
        let expected = getStateAfterDataWasInitialized();
        connection.Initialize();
        let actual = expect(connection.StateData);
        actual.toEqual(expected)
    });

    test('StateAfterOpen', () =>{
        let expected = getStateAfterOpen();
        connection.Open();
        let actual = expect(connection.StateData);
        actual.toEqual(expected)
    });

    test('StateAfterRecordSuccessfulOpen', () => {
        let expected = getStateAfterRecordSuccessfulOpen();
        connection.RecordSuccessfulOpen();
        let actual = expect(connection.StateData);
        actual.toEqual(expected)
    });

    test('StateAfterLock', () => {
        let expected = getStateAfterLock();
        connection.Lock();
        let actual = expect(connection.StateData);
        actual.toEqual(expected)
    });

    test('getStateAfterUnlock', () => {
        let expected = getStateAfterUnlock();
        connection.Unlock();
        let actual = expect(connection.StateData);
        actual.toEqual(expected);
    });

    test('getStateAfterClose', () => {
        let expected = getStateAfterClose();
        connection.Close();
        let actual = expect(connection.StateData);
        actual.toEqual(expected);
    });

});

