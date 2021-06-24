/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ConnectionStateName } from "./ConnectionStateEnum";
import { IMLApiInvoker } from "./data/MLApiInvoker";
import { ConnectionStateDataType } from "./ConnectionStateData";

export class Connection {
    private readonly _name: string;
    private _currentStateName: ConnectionStateName;
    private _stateData: ConnectionStateDataType;
    private _compromiseException: Error | undefined;
    private mlApiInvoker: IMLApiInvoker;

    constructor(name: string, mlApiInvoker: IMLApiInvoker) {
        this._name = name;
        this._currentStateName = ConnectionStateName.Null;
        this._stateData = {
            IsInitialized: false,
            IsConnecting: false,
            IsOpen: false,
            IsLocked: false,
            IsCompromised: false
        }
        this.mlApiInvoker = mlApiInvoker;
    }

    private SetNullState() {
        this._stateData.IsInitialized = false;
        this._stateData.IsConnecting = false;
        this._stateData.IsOpen = false;
        this._stateData.IsLocked = false;
        this._stateData.IsCompromised = false;
    }

    public Initialize = () => {
        try {
            this._currentStateName = ConnectionStateName.Initialized;
            this._stateData.IsInitialized = true;
            this._stateData.IsConnecting = false;
            this._stateData.IsOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    };

    Open = () => {
        // Code that will make a call to API
        try {
            this._currentStateName = ConnectionStateName.Connecting;
            this._stateData.IsConnecting = true;
            this._stateData.IsOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    };

    RecordSuccessfulOpen = () => {
        try {
            this._currentStateName = ConnectionStateName.Open;
            this._stateData.IsConnecting = false;
            this._stateData.IsOpen = true;
            this._stateData.IsLocked = false;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    };

    Lock = () => {
        try {
            this._currentStateName = ConnectionStateName.Locked;
            this._stateData.IsLocked = true;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    };

    Unlock = () => {
        try {
            this._currentStateName = ConnectionStateName.Open;
            this._stateData.IsConnecting = false;
            this._stateData.IsOpen = true;
            this._stateData.IsLocked = false;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    };

    Close = () => {
        try {
            this._currentStateName = ConnectionStateName.Initialized;
            this._stateData.IsInitialized = true;
            this._stateData.IsConnecting = false;
            this._stateData.IsOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentStateName = ConnectionStateName.Compromised;
            this._compromiseException = e;
        }
    }

    get Name(): string {
        return this._name;
    }

    get CurrentStateName(): string {
        return this._currentStateName;
    }

    get CompromiseException(): Error | undefined {
        return this._compromiseException;
    }

    get StateData(): ConnectionStateDataType {
        return this._stateData;
    }

}
