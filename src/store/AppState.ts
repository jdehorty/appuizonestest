/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import {AnyAction, CombinedState, combineReducers, createStore, Reducer, Store} from "redux";
import {FrameworkReducer, FrameworkState} from "@bentley/ui-framework";
// import { SelectionExtenderState, SelectionExtenderReducer } from "../SelectionExtender";
import {LabelingWorkflowManagerReducer} from "./LabelingWorkflowReducer";
import {LabelingWorkflowState} from "./LabelingWorkflowState";
import {SelectionExtenderState} from "./SelectionExtenderState";
import {SelectionExtenderReducer} from "./SelectionExtenderReducer2";
import {devToolsEnhancer} from 'redux-devtools-extension';


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

/*
 * Centralized state management class using Redux actions, reducers and store.
 */
export class AppState {
    private readonly _store: AppStore;
    private readonly _rootReducer: Reducer<CombinedState<RootState>>;

    constructor() {
        // this is the rootReducer for the sample application.
        this._rootReducer = combineReducers<RootState>({
            frameworkState: FrameworkReducer,
            selectionExtenderState: SelectionExtenderReducer,
            labelingWorkflowManagerState: LabelingWorkflowManagerReducer,
        } as any);

        // TODO: Remove this before we push to PROD.
        // let enhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()

        // create the Redux Store.
        this._store = createStore(this._rootReducer, devToolsEnhancer({serialize: true}));
    }

    public get store(): Store<RootState> {
        return this._store;
    }
    
}
