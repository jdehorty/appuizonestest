
import { Config } from "@bentley/bentleyjs-core";
import { UrlDiscoveryClient } from "@bentley/itwin-client";
import { BentleyCloudRpcParams } from "@bentley/imodeljs-common";
import { FrontendRequestContext } from "@bentley/imodeljs-frontend";
import { IModelAppOptions } from "@bentley/imodeljs-frontend";
import { I18NNamespace } from "@bentley/imodeljs-i18n";
// import { FindSimilar } from "@bentley/itwin-find-similar";
import { Presentation } from "@bentley/presentation-frontend";
// import { UiComponents } from "@bentley/ui-components";
// import { UiCore } from "@bentley/ui-core";
import { UiFramework } from "@bentley/ui-framework";
// import InitLogging from "../../ml-labeler-master/ml-labeler-master/IModelJsLabeler/imodeljs-labeler-prototype/src/frontend/api/logging";
// import { OidcClientHelper } from "../../ml-labeler-master/ml-labeler-master/IModelJsLabeler/imodeljs-labeler-prototype/src/frontend/api/OidcClientHelper";
import InitRpc from "./common/configuration/rpc";
// import { LabelingWorkflowManager } from "../../ml-labeler-master/ml-labeler-master/IModelJsLabeler/imodeljs-labeler-prototype/src/frontend/labeling-workflow/LabelingWorkflowManager";
import { SelectionExtender } from "./SelectionExtender2";

import {AppState, AppStore} from "./AppState";

// initialize logging
// InitLogging();

// subclass of IModelApp needed to use imodeljs-frontend
export class LabelingApp {

    private static _appState: AppState;

    public static get store(): AppStore {
        return this._appState.store;
    }

    private static _appInitializationPromiseStatus: Promise<void>;

    private static _i18nAppNamespace: I18NNamespace;

    public static get ready(): Promise<void> {
        return this._appInitializationPromiseStatus;
    }

    public static startup(opts?: IModelAppOptions): void {

    //    if (!IModelApp.initialized) {
    //        IModelApp.startup(opts);
    //    }

        // contains various initialization promises which need to be fulfilled before the app is ready
       // const initPromises: Promise<void>[] = [];

        //
//        this._i18nAppNamespace = IModelApp.i18n.registerNamespace("LabelingApp");
//        initPromises.push(this._i18nAppNamespace.readFinished);
        //
        //     // create the application state store for Redux
        this._appState = new AppState();
        //
        //     // initialize UiCore, UiComponents and UiFramework
        //     initPromises.push(UiCore.initialize(IModelApp.i18n));
        //     initPromises.push(UiComponents.initialize(IModelApp.i18n));
//        initPromises.push(UiFramework.initialize(this.store, IModelApp.i18n, "frameworkState"));
        //
        //     initPromises.push(FindSimilar.initialize(IModelApp.i18n));
        //
        //     // initialize Presentation
//        Presentation.initialize({
//               // activeLocale: IModelApp.i18n.languageList()[0],
//               activeLocale: "en",
//           });

        // initialize RPC communication
//        initPromises.push(LabelingApp.initializeRpc());

        //     // initialize OIDC
        //     initPromises.push(OidcClientHelper.initializeOidc());
        //
        // initialize SelectionHelper
        // initPromises.push(SelectionExtender.initialize(this.store, IModelApp.i18n, "selectionExtenderState"));
        //SelectionExtender.initialize(this.store, "selectionExtenderState");
        //
        //     // initialize machine learning i18n
        //     initPromises.push(IModelApp.i18n.registerNamespace("MachineLearning").readFinished);
        //
        //     // // initialize LabelManager
        //     // initPromises.push(LabelManager.initialize(this.store, IModelApp.i18n, "labelManagerState"));
        //
        //     // initialize LabelingWorkflowManager
        //     initPromises.push(LabelingWorkflowManager.initialize(this.store, IModelApp.i18n, "labelingWorkflowManagerState"));

        // initPromises.push(LabelingWorkflowManager.initialize(this.store, IModelApp.i18n, "labelingWorkflowManagerState"));


        //
            // the app is ready when all initialization promises are fulfilled
 //       this._appInitializationPromiseStatus = Promise.all(initPromises).then(
 //           () => { });
 //           console.log("All LabellingApp.startup promises have resolved.");

    }

    // public static shutdown() {
    //     IModelApp.shutdown();
    // }

    private static async initializeRpc(): Promise<void> {
        console.log("initializing RPC");
        const rpcParams = await this.getConnectionInfo();
        InitRpc(rpcParams);
    }

    private static async getConnectionInfo(): Promise<BentleyCloudRpcParams | undefined> {
        const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
        const urlClient = new UrlDiscoveryClient();
        const requestContext = new FrontendRequestContext();
        const orchestratorUrl = await urlClient.discoverUrl(requestContext, "iModelJsOrchestrator.SF", buddiRegion); // 103 for dev
        //const orchestratorUrl = await urlClient.discoverUrl(requestContext, "iModelJsOrchestrator.K8S", buddiRegion); // 103 for dev
        return { info: { title: "navigator-backend", version: "v1.0" }, uriPrefix: orchestratorUrl };
    }

}
