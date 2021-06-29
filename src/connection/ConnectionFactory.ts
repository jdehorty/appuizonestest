/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * This is the class that is used to manage connection state.
 */

import { Connection } from "./Connection";
import { IMLApiInvoker } from "./data/MLApiInvoker";
import { ConnectionNameAlreadyExistsError } from "./Errors/DuplicateNameError";

export class ConnectionFactory {
    private readonly _connections: Map<string, Connection>;
    private readonly _mlApiInvoker: IMLApiInvoker;

    constructor(mlApiInvoker: IMLApiInvoker) {
        this._connections = new Map<string, Connection>();
        this._mlApiInvoker = mlApiInvoker;
    }

    /**
     * Create a connection for the caller and record it in our list of connections.
     * If the conenction already exists, a ConnectionNameAlreadyExistsError is thrown.
     * @param connectionName - caller-defined name for the connection.
     */
    public createConnection = (connectionName: string) => {
        if (this._connections.has(connectionName)) {
            throw new ConnectionNameAlreadyExistsError(connectionName);
        }
        let connection: Connection = new Connection(connectionName, this._mlApiInvoker);
        this._connections.set(connectionName, connection);
        return connection;
    };

    /**
     * Allow caller to get a list of connections that have been created by this factory.
     */
    get Connections(): Map<string, Connection> {
        return this._connections;
    }
}