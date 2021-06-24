/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {
    getInitialState
} from "./data/ConnectionStateFactory";
import { MockMLApiInvoker } from "./data/MockMLApiInvoker";
import { ConnectionFactory } from "../ConnectionFactory";


describe('Labeling Connection State Transitions', () => {

    test('InitialState', () => {

        let expected = getInitialState();

        // Initial State
        let mockMLApiInvoker = new MockMLApiInvoker();
        let connectionFactory = new ConnectionFactory(mockMLApiInvoker);
        let connection = connectionFactory.createConnection("testConnection");

        connection.Initialize();

        let received = expect(connection);

        received.toEqual(expected);
    });

    // test('StateAfterDataWasInitialized', () =>{
    //
    //     let before = getInitialState();
    //
    //     let expected = {
    //         ...connection,
    //         isInitialized: true,
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.Initialize,
    //         isInitialized: true,
    //     }))
    //
    //     received.toEqual(expected)
    // })
    //
    // test('StateAfterOpen', () =>{
    //     let before = getStateAfterDataWasInitialized();
    //
    //     let expected = {
    //         ...before,
    //         isConnecting: true,
    //         isOpen: false
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.Open,
    //         isConnecting: true,
    //         isOpen: false
    //     }))
    //
    //     received.toEqual(expected)
    // })
    //
    // test('RecordSuccessfulOpen', () =>{
    //     let before = getStateAfterOpen();
    //
    //     let expected = {
    //         ...before,
    //         isConnecting: false,
    //         isOpen: true,
    //         isLocked: false
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.RecordSuccessfulOpen,
    //         isConnecting: false,
    //         isOpen: true,
    //         isLocked: false
    //     }))
    //
    //     received.toEqual(expected)
    // })
    //
    // test('Lock', () => {
    //     let before = getStateAfterRecordSuccessfulOpen();
    //
    //     let expected = {
    //         ...before,
    //         isLocked: true
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.Lock,
    //         isLocked: true
    //     }))
    //
    //     received.toEqual(expected)
    //
    // });
    //
    // test('Unlock', () => {
    //     let before = getStateAfterLock();
    //
    //     let expected = {
    //         ...before,
    //         isConnecting: false,
    //         isOpen: true,
    //         isLocked: false
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.Unlock,
    //         isConnecting: false,
    //         isOpen: true,
    //         isLocked: false
    //     }))
    //
    //     received.toEqual(expected)
    // });
    //
    // test('Close', () => {
    //     let before = getStateAfterUnlock();
    //
    //     let expected = {
    //         ...before,
    //         isInitialized: true,
    //         isConnecting: false,
    //         isOpen: false
    //     }
    //
    //     let received = expect(reducer(before, <action>{
    //         type: LabelingConnectionActionType.Close,
    //         isInitialized: true,
    //         isConnecting: false,
    //         isOpen: false
    //     }))
    //
    //     received.toEqual(expected)
    // });

});