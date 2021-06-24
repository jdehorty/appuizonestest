/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * This is the ML Labeling Tool class that is used to manage its connection state.
 */

import { Connection, IConnection } from "./Connection";
import { IMLApiInvoker } from "./data/MLApiInvoker";

export class ConnectionFactory {
    private readonly _connections: Map<string, IConnection>;
    private readonly _mlApiInvoker: IMLApiInvoker;

    constructor(mlApiInvoker: IMLApiInvoker) {
        this._connections = new Map<string, IConnection>();
        this._mlApiInvoker = mlApiInvoker;
    }

    /**
     * Create a connection for the caller and record it in our list of connections.
     * @param connectionName - caller-defined name for the connection.
     */
    createConnection(connectionName: string): IConnection {
        // TODO: Check to see if a connection with connectionName already exists in our connections map.
        let connection: IConnection = new Connection(connectionName, this._mlApiInvoker);
        this._connections.set(connectionName, connection);
        return connection;
    }

    /**
     * Allow caller to get a list of connections that have been created by this factory.
     */
    get Connections(): Map<string, IConnection> {
        return this._connections;
    }

    // TODO: Add method to remove connections by name from our connections map.
}