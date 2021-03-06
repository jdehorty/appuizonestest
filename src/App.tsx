import "./styles/App.scss";

import {Viewer} from "@bentley/itwin-viewer-react";
import React, {useEffect, useState} from "react";

import {IModelApp, IModelConnection, AuthorizedFrontendRequestContext} from "@bentley/imodeljs-frontend";
import {ChangeSetQuery} from "@bentley/imodelhub-client";

import AuthorizationClient from "./AuthorizationClient";
import {Header} from "./Header";
import {LabelerUiProvider} from "./LabelerUiProvider";

import {LabelingApp} from "./LabelingApp";

import {SelectionExtender} from "./SelectionExtender";

import {Presentation} from "@bentley/presentation-frontend";
import {SetupConfigEnv} from "./config/configuration";
import {Config} from "@bentley/bentleyjs-core";
import {LabelingWorkflowManager} from "./LabelingWorkflowManager";
import {BlobBasedLabelDataSourceConfig, BlobBasedMachineLearningLabelInterface} from "./BlobLabelSources";

// import { UiItemsManager } from "@bentley/ui-abstract";
// import { LabelerUiProvider } from "./sampleFrontstageProvider";


const App: React.FC = () => {
    const [isAuthorized, setIsAuthorized] = useState(AuthorizationClient.oidcClient ? AuthorizationClient.oidcClient.isAuthorized : false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const initOidc = async () => {
            SetupConfigEnv(102);

            if (!AuthorizationClient.oidcClient) {
                await AuthorizationClient.initializeOidc();
            }

            try {
                // attempt silent signin
                await AuthorizationClient.signInSilent();
                // console.log("setting IsAuthorized flag to => " + AuthorizationClient.oidcClient.isAuthorized);
                setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
                // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
                // console.log("1C. buddi (with region) setting is => " + buddiRegion);

            } catch (error) {
                console.log("ERROR: useEffect #1, during oidc initialization");
            }
        };
        initOidc().catch((error) => console.error(error));
        // console.log("ue1.A Completed oidc.Init");
        // console.log("ue1.B sLoggingIn => " + isLoggingIn);
        // console.log("ue1.C isAuthorized => " + isAuthorized);
        // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
        // console.log("1B. buddi (with region) setting is => " + buddiRegion);
    }, []);

    // console.log("useEffect #2");
    useEffect(() => {
        // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
        // console.log("2. buddi (with region) setting is => " + buddiRegion);
        if (!process.env.IMJS_CONTEXT_ID) {
            throw new Error(
                "Please add a valid context ID in the .env file and restart the application"
            );
        }
        if (!process.env.IMJS_IMODEL_ID) {
            throw new Error(
                "Please add a valid iModel ID in the .env file and restart the application"
            );
        }

        // console.log("IMJS_CONTEXT_ID =>" + process.env.IMJS_CONTEXT_ID);
        // console.log("IMJS_IMODEL_ID =>" + process.env.IMJS_IMODEL_ID);

    }, []);


    // console.log("useEffect #3");
    useEffect(() => {
        // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
        // console.log("3. buddi (with region) setting is => " + buddiRegion);
        if (isLoggingIn && isAuthorized) {
            setIsLoggingIn(false);
        }
    }, [isAuthorized, isLoggingIn]);

    // console.log("useEffect #4");
    useEffect(() => {
        // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
        // console.log("4. buddi (with region) setting is => " + buddiRegion);
        // console.log("ue4.B sLoggingIn => " + isLoggingIn);
        // console.log("ue4.C isAuthorized => " + isAuthorized);
    }, [isAuthorized, isLoggingIn]);

    // useEffect (() => {
    //    UiItemsManager.register( new LabelerUiProvider());
    // }, []);

    const onLoginClick = async () => {
        setIsLoggingIn(true);
        await AuthorizationClient.signIn();
        // console.log("onLoginClick complete");
    };

    const onLogoutClick = async () => {
        // console.log("onLogoutClick");
        setIsLoggingIn(false);
        await AuthorizationClient.signOut();
        setIsAuthorized(false);
    };

    const openLabelSource = async (imodel: IModelConnection) => {
        const config: BlobBasedLabelDataSourceConfig = {
            accountName: Config.App.getString("mlAccountName"),
            sasString: Config.App.getString("mlSasString"),
            projectGuid: Config.App.getString("mlProjectGuid"),
            imodelGuid: Config.App.getString("mlIModelGuid"),
            imodelName: Config.App.getString("mlIModelName"),
            revisionId: Config.App.getString("mlChangeSetId"),
            predSuffix: Config.App.getString("mlPredSuffix")
        }

        console.log("Config => " + JSON.stringify(config))

        const labelInterface = new BlobBasedMachineLearningLabelInterface(config);

        LabelingWorkflowManager.configureDataSources(labelInterface, imodel);
        await LabelingWorkflowManager.initializeData();

        // LabelManager.configureDataSources(labelInterface, imodel);
        // await LabelManager.initializeData();

        // Hack to transfer mesh ids
        SelectionExtender.auxDataMap = LabelingWorkflowManager.auxDataMap;
    }

    const onIModelConnected = async (connection: any) => {
        console.log("onIModelConnected invoked");
        // console.log("IModelApp.isInitialized => " + IModelApp.initialized);
        // console.log("connection =>" + JSON.stringify(connection));

        try {
            await Presentation.initialize({
                // activeLocale: IModelApp.i18n.languageList()[0],
                activeLocale: "en",
            });
        } catch (error) {
        }

        // console.log("Presentation initialized");

        const initPromises: Promise<void>[] = [];

        initPromises.push(SelectionExtender.initialize(LabelingApp.store, IModelApp.i18n, "selectionExtenderState"));
        initPromises.push(LabelingWorkflowManager.initialize(LabelingApp.store, IModelApp.i18n, "labelingWorkflowManagerState"));
        initPromises.push(IModelApp.i18n.registerNamespace("MachineLearning").readFinished);

        Promise.all(initPromises).then(
            () => {
            });
        console.log("All onIModelConnected initialization function promises have resolved.");

        const requestContext: AuthorizedFrontendRequestContext = await AuthorizedFrontendRequestContext.create();
        const changeSetQuery = new ChangeSetQuery();
        changeSetQuery.latest();
        const changesets = await IModelApp.iModelClient.changeSets.get(requestContext, process.env.IMJS_IMODEL_ID as string, changeSetQuery);

        if (changesets.length !== 0) {
            Config.App.set("mlChangeSetId", changesets[0].id!);
        } else {
            console.log("ChangeSet not found");
        }

        openLabelSource(connection).then(() => {
            // setReadyForPopup(true);
        });
    }


    // const onIModelAppInit = async () => {
    //     console.log("onIModelAppInit invoked");

    //     const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
    //     console.log("9. buddi (with region) setting is => " + buddiRegion);
    // }

    return (
        <div>
            <Header
                handleLogin={onLoginClick}
                loggedIn={isAuthorized}
                handleLogout={onLogoutClick}
            />
            {isLoggingIn ? (
                <span>Logging in...</span>
            ) : (
                isAuthorized && (
                    <div>
                        <Viewer
                            contextId={process.env.IMJS_CONTEXT_ID ?? ""}
                            iModelId={process.env.IMJS_IMODEL_ID ?? ""}
                            authConfig={{oidcClient: AuthorizationClient.oidcClient}}
                            theme={"light"}
                            defaultUiConfig={
                                {
                                    hideToolSettings: false,
                                    hideTreeView: false,
                                }
                            }
                            uiProviders={[new LabelerUiProvider()]}
                            onIModelConnected={onIModelConnected}
                            // onIModelAppInit={onIModelAppInit}
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default App;
