/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {
    getInitialState,
    getStateAfterDataWasInitialized, getStateAfterLock,
    getStateAfterOpen,
    getStateAfterRecordSuccessfulOpen, getStateAfterUnlock
} from "./data/ConnectionStateFactory";
import { LabelingConnectionAction as action } from "../../store/definitions/LCActionsDef";
import { LabelingConnectionActionType } from "../../store/actionTypes/LCActionTypes";
import { IMLApiInvoker, MLAPIInvoker } from "../data/MLApiInvoker";
import { MockMLApiInvoker } from "./data/MockMLApiInvoker";
import { ConnectionFactory } from "../ConnectionFactory";
import { Connection, IConnection } from "../Connection";

describe('Labeling Connection State Transitions', () => {

    test('InitialState', () => {

        // Initial State
        let mockMLApiInvoker = new MockMLApiInvoker();
        let connectionFactory = new ConnectionFactory(mockMLApiInvoker);
        let connection = connectionFactory.createConnection("testConnection");
        let myConn = connection as Connection;

        myConn.Initialize();

        let expected = getInitialState();

        let received = expect(myConn);

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