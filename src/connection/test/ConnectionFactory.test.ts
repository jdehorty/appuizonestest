/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ConnectionFactory } from "../ConnectionFactory";
import { MockMLApiInvoker } from "./data/MockMLApiInvoker";
import { getInitialState } from "./data/ConnectionStateFactory";
import { ConnectionNameAlreadyExistsError } from "../Errors/DuplicateNameError";

export {}

// TODO: Try adding two connections with the same name, make sure the factory class handles it correctly.
// (Note: Update factory class to check for name uniqueness itself. Throw a meaningful exception in that case.


describe('Tests for ConnectionFactory', () => {
    let mockMLApiInvoker = new MockMLApiInvoker();
    let connectionFactory: ConnectionFactory;

    beforeEach(() => {
        connectionFactory = new ConnectionFactory(mockMLApiInvoker);
    });

    test('Factory has zero connections in null (unintialized) state', () => {
        let expectedNumberOfConnectionsRecorded = 0;
        let actual = expect(connectionFactory.Connections.size);
        actual.toEqual(expectedNumberOfConnectionsRecorded);
    });

    test('Factory creates connections in null (unintialized) state', () => {
        let firstConnectionName = "firstName";
        let connection = connectionFactory.createConnection(firstConnectionName);
        let expectedStataData = getInitialState();
        let actual = expect(connection.StateData);
        actual.toEqual(expectedStataData);
        let expectedName = firstConnectionName;
        actual = expect(connection.Name);
        actual.toEqual(expectedName);
        let expectedNumberOfConnectionsRecorded = 1;
        actual = expect(connectionFactory.Connections.size);
        actual.toEqual(expectedNumberOfConnectionsRecorded);
    });

    test('Factory records all connections internally', () => {
        let firstConnectionName = "firstName";
        connectionFactory.createConnection(firstConnectionName);
        let secondConnectionName = "secondName";
        let secondConnection = connectionFactory.createConnection(secondConnectionName);
        let expectedName = secondConnectionName;
        let actual = expect(secondConnection.Name);
        actual.toEqual(expectedName);
        let expectedNumberOfConnectionsRecorded = 2;
        actual = expect(connectionFactory.Connections.size);
        actual.toEqual(expectedNumberOfConnectionsRecorded);
    });

    test('Factory throws exception if connection with duplicate name is created', () => {
        let firstConnectionName = "firstName";
        connectionFactory.createConnection(firstConnectionName);
        let duplicateName = firstConnectionName;
        expect(() => connectionFactory.createConnection(duplicateName)).toThrow(ConnectionNameAlreadyExistsError);
    });

});
