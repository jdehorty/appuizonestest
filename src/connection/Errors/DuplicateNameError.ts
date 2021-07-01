/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * Use a custom error to shift the burden of internationalization to the user.
 */
class ConnectionNameAlreadyExistsError extends Error {
    constructor(connectionName: string) {
        super(connectionName);
        this.name = 'ConnectionNameAlreadyExistsError';
    }
}

export { ConnectionNameAlreadyExistsError };
