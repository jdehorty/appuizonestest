/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

export type ConnectionStateDataType = {
    IsInitialized: boolean;
    IsConnecting: boolean;
    IsOpen: boolean;
    IsLocked: boolean;
    IsCompromised: boolean;
}

// export interface IConnectionStateData {
//     IsInitialized: boolean;
//     IsConnecting: boolean;
//     IsOpen: boolean;
//     IsLocked: boolean;
//     IsCompromised: boolean;
// }
//
// export class ConnectionStateData implements IConnectionStateData {
//     constructor() {
//         this._isInitialized = false;
//         this._isConnecting = false;
//         this._isOpen = false;
//         this._isLocked = false;
//         this._isCompromised = false;
//     }
//
//     private _isInitialized: boolean;
//     private _isConnecting: boolean;
//     private _isOpen: boolean;
//     private _isLocked: boolean;
//     private _isCompromised: boolean;
//
//     get IsInitialized(): boolean {
//         return this._isInitialized;
//     }
//
//     set IsInitialized(value: boolean) {
//         this._isInitialized = value;
//     }
//
//     get IsConnecting(): boolean {
//         return this._isConnecting;
//     }
//
//     set IsConnecting(value: boolean) {
//         this._isConnecting = value;
//     }
//
//     get IsOpen(): boolean {
//         return this._isOpen;
//     }
//
//     set IsOpen(value: boolean) {
//         this._isOpen = value;
//     }
//
//     get IsLocked(): boolean {
//         return this._isLocked;
//     }
//
//     set IsLocked(value: boolean) {
//         this._isLocked = value;
//     }
//
//     get IsCompromised(): boolean {
//         return this._isCompromised;
//     }
//
//     set IsCompromised(value: boolean) {
//         this._isCompromised = value;
//     }
// }