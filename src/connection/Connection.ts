/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { ConnectionState } from "./ConnectionStateEnum";
import { IMLApiInvoker } from "./data/MLApiInvoker";

export interface IConnection {
    Name: string;
    CurrentState: string;
    IsInitialized: boolean;
    IsConnecting: boolean;
    IsOpen: boolean;
    IsLocked: boolean;
    IsCompromised: boolean;
}

export class Connection implements IConnection {
    private readonly _name: string;
    private _currentState: ConnectionState;
    private _isInitialized: boolean;
    private _isConnecting: boolean;
    private _isOpen: boolean;
    private _isLocked: boolean;
    private _isCompromised: boolean;
    private _compromiseException: Error | undefined;
    private mlApiInvoker: IMLApiInvoker;

    constructor(name: string, mlApiInvoker: IMLApiInvoker) {
        this._name = name;
        this._currentState = ConnectionState.Null;
        this._isInitialized = false;
        this._isConnecting = false;
        this._isOpen = false;
        this._isLocked = false;
        this._isCompromised = false;
        this.mlApiInvoker = mlApiInvoker;
    }

    private SetNullState() {
        this._isInitialized = false;
        this._isConnecting = false;
        this._isOpen = false;
        this._isLocked = false;
        this._isCompromised = false;
    }

    public Initialize = () => {
        try {
            this._currentState = ConnectionState.Initialized;
            this._isInitialized = true;
            this._isConnecting = false;
            this._isOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }

    };

    Open = () => {
        // Code that will make a call to API
        try {
            this._currentState = ConnectionState.Connecting;
            this._isConnecting = true;
            this._isOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }
    };

    RecordSuccessfulOpen = () => {
        try {
            this._currentState = ConnectionState.Open;
            this._isConnecting = false;
            this._isOpen = true;
            this._isLocked = false;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }
    };

    Lock = () => {
        try {
            this._currentState = ConnectionState.Locked;
            this._isLocked = true;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }
    };

    Unlock = () => {
        try {
            this._currentState = ConnectionState.Open;
            this._isConnecting = false;
            this._isOpen = true;
            this._isLocked = false;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }
    };

    Close = () => {
        try {
            this._currentState = ConnectionState.Initialized;
            this._isInitialized = true;
            this._isConnecting = false;
            this._isOpen = false;
        } catch (e) {
            this.SetNullState();
            this._currentState = ConnectionState.Compromised;
            this._compromiseException = e;
        }
    }

    get Name(): string {
        return this._name;
    }

    get CurrentState(): string {
        return this._currentState;
    }

    get IsInitialized(): boolean {
        return this._isInitialized;
    }

    get IsConnecting(): boolean {
        return this._isConnecting;
    }

    get IsOpen(): boolean {
        return this._isOpen;
    }

    get IsLocked(): boolean {
        return this._isLocked;
    }

    get IsCompromised(): boolean {
        return this._isCompromised;
    }

    get CompromiseException(): Error | undefined {
        return this._compromiseException;
    }

}
