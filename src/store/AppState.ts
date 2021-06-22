/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import {CombinedState, combineReducers, createStore, Reducer, Store} from "redux";
import {FrameworkReducer, FrameworkState} from "@bentley/ui-framework";
import {LabelingWorkflowManagerReducer} from "./reducers/LWReducers";
import {LWState} from "./state/LWState";
import {SelectionExtenderState} from "./state/SEState";
import {INITIAL_LC_STATE} from "./state/LCState";
import {SelectionExtenderReducer} from "./reducers/SEReducers";
import {devToolsEnhancer} from 'redux-devtools-extension';
import { SEStateType } from "./types/SETypes";
import { LabelingConnectionStateReducer } from "./reducers/LCReducers";


// React-redux interface stuff
export type RootStateType = {
    frameworkState?: FrameworkState;
    selectionExtenderState?: SEStateType;
    labelingWorkflowManagerState?: LWState;
}

export interface RootAction {
    type: string;
}

export type AppStore = Store<RootStateType>;

/*
 * Centralized state management class using Redux actions, reducers and store.
 */
export class AppState {
    private readonly _store: AppStore;
    private readonly _rootReducer: Reducer<CombinedState<RootStateType>>;

    constructor() {
        // this is the rootReducer for the application
        this._rootReducer = combineReducers<RootStateType>({
            frameworkState: FrameworkReducer,
            selectionExtenderState: SelectionExtenderReducer,
            labelingWorkflowManagerState: LabelingWorkflowManagerReducer,
            connectionState: LabelingConnectionStateReducer
        } as any);

        // create the Redux Store.
        this._store = createStore(this._rootReducer, devToolsEnhancer({serialize: true}));
    }

    public get store(): Store<RootStateType> {
        return this._store;
    }
    
}
