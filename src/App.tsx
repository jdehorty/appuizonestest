/*
 *
 *  * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 *
 */

import "./styles/_App.scss";

import { Viewer } from "@bentley/itwin-viewer-react";
import React, { useEffect, useState } from "react";

import {
    AuthorizedFrontendRequestContext,
    IModelApp,
    IModelConnection,
    ScreenViewport,
    ViewState3d
} from "@bentley/imodeljs-frontend";

import { ChangeSetQuery } from "@bentley/imodelhub-client";

import AuthorizationClient from "./AuthorizationClient";
import { Header } from "./Header";
import { LabelerUiProvider } from "./LabelerUiProvider";

import { LabelerState } from "./store/LabelerState";

import { SelectionExtender } from "./SelectionExtender";

import { Presentation } from "@bentley/presentation-frontend";
import { SetupConfigFromEnv } from "./config/configuration";
import { Config } from "@bentley/bentleyjs-core";
import { LabelingWorkflowManager } from "./LabelingWorkflowManager";
import { BlobBasedLabelDataSourceConfig, BlobBasedMachineLearningLabelInterface } from "./data/BlobLabelSources";

const App: React.FC = () => {
    const [isAuthorized, setIsAuthorized] = useState(AuthorizationClient.oidcClient ? AuthorizationClient.oidcClient.isAuthorized : false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const initOidc = async () => {
            SetupConfigFromEnv(102);

            if (!AuthorizationClient.oidcClient) {
                await AuthorizationClient.initializeOidc();
            }

            try {
                // attempt silent signin
                await AuthorizationClient.signInSilent();
                setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);

            } catch (error) {
                console.log("ERROR: useEffect #1, during oidc initialization");
            }
        };
        initOidc().catch((error) => console.error(error));
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (isLoggingIn && isAuthorized) {
            setIsLoggingIn(false);
        }
    }, [isAuthorized, isLoggingIn]);

    useEffect(() => {
    }, [isAuthorized, isLoggingIn]);

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

        const labelInterface = new BlobBasedMachineLearningLabelInterface(config);

        LabelingWorkflowManager.configureDataSources(labelInterface, imodel);
        await LabelingWorkflowManager.initializeData();

        // Hack to transfer mesh ids
        SelectionExtender.auxDataMap = LabelingWorkflowManager.auxDataMap;
    }

    const onIModelConnected = async (connection: IModelConnection) => {
        try {
            await Presentation.initialize({
                // activeLocale: IModelApp.i18n.languageList()[0],
                activeLocale: "en",
            });
        } catch (error) {
            // Ignore
        }

        const initPromises: Promise<void>[] = [];
        initPromises.push(SelectionExtender.initialize(LabelerState.store, IModelApp.i18n, "selectionExtenderState"));
        initPromises.push(LabelingWorkflowManager.initialize(LabelerState.store, IModelApp.i18n, "labelingWorkflowManagerState"));
        initPromises.push(IModelApp.i18n.registerNamespace("MachineLearning").readFinished);
        initPromises.push(IModelApp.i18n.registerNamespace("LabelingApp").readFinished);
        await Promise.all(initPromises)

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

        let vpCount = 0;
        IModelApp.viewManager.forEachViewport((vp: ScreenViewport) => {
            vpCount++;
            if (vp.view.is3d()) {
                const view: ViewState3d = vp.view;
                view.getDisplayStyle3d().environment.sky.display = false;
                view.getDisplayStyle3d().environment.ground.display = false;
            }
        });
    }

    const onIModelAppInit = async () => {

    }

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
                            authConfig={{ oidcClient: AuthorizationClient.oidcClient }}
                            theme={"light"}
                            defaultUiConfig={
                                {
                                    hideToolSettings: false,
                                    hideTreeView: false,
                                }
                            }
                            uiProviders={[new LabelerUiProvider()]}
                            onIModelConnected={onIModelConnected}
                            onIModelAppInit={onIModelAppInit}
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default App;
