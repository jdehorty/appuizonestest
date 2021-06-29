/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

class ConnectionNameAlreadyExistsError extends Error {
    constructor(connectionName: string) {
        super(connectionName);
        this.name = 'ConnectionNameAlreadyExistsError';
    }
}

export { ConnectionNameAlreadyExistsError };
