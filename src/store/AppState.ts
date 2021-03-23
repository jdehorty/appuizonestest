/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import {combineReducers, createStore, Store, StoreEnhancer} from "redux";
import {FrameworkReducer, FrameworkState} from "@bentley/ui-framework";
import {LabelingWorkflowManagerReducer} from "./LabelingWorkflowReducer";
import {LabelingWorkflowState} from "./LabelingWorkflowState";
import {SelectionExtenderState} from "./SelectionExtenderState";
import {SelectionExtenderReducer} from "./SelectionExtenderReducer2";

import { composeWithDevTools } from 'redux-devtools-extension';


// React-redux interface stuff
export interface RootState {
    frameworkState?: FrameworkState;
    selectionExtenderState?: SelectionExtenderState;
    labelingWorkflowManagerState?: LabelingWorkflowState;
}

export interface RootAction {
    type: string;
}

export type AppStore = Store<RootState>;

/**
 * Centralized state management class using Redux actions, reducers and store.
 */
export class AppState {
    private  _store: AppStore;
    private  _rootReducer: any;

    constructor() {
        // this is the rootReducer for the sample application.
        this._rootReducer = combineReducers<RootState>({
            frameworkState: FrameworkReducer,
            selectionExtenderState: SelectionExtenderReducer,
            labelingWorkflowManagerState: LabelingWorkflowManagerReducer,
        } as any);

        let enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 })

        // create the Redux Store.
        this._store = createStore(this._rootReducer, enhancer);

    }

    public get store(): Store<RootState> {
        return this._store;
    }

}
