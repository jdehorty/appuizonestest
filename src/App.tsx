import "./App.scss";

import {Viewer} from "@bentley/itwin-viewer-react";
import React, {useEffect, useState} from "react";

import { IModelApp, IModelConnection, AuthorizedFrontendRequestContext } from "@bentley/imodeljs-frontend";
import { ChangeSetQuery } from "@bentley/imodelhub-client";

import AuthorizationClient from "./AuthorizationClient";
import {Header} from "./Header";
import {TestUiProvider} from "./TestUiProvider";

import {LabelingApp} from "./LabelingApp";

import {SelectionExtender} from "./SelectionExtender2";

import {Presentation} from "@bentley/presentation-frontend";
import {SetupConfigEnv} from "./common/configuration/configuration";
import {GuidString} from "@bentley/bentleyjs-core";
import {LabelingWorkflowManager} from "./LabelingWorkflowManager";
import { BlobBasedLabelDataSourceConfig, BlobBasedMachineLearningLabelInterface } from "./BlobLabelSources";


// import { UiItemsManager } from "@bentley/ui-abstract";
// import { TestUiProvider } from "./sampleFrontstageProvider";


const App: React.FC = () => {
    //console.log("useState #1");
    const [isAuthorized, setIsAuthorized] = useState(AuthorizationClient.oidcClient ? AuthorizationClient.oidcClient.isAuthorized : false);

    //console.log("useState #2");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    //console.log("useEffect #1");
    useEffect(() => {
        const initOidc = async () => {
            SetupConfigEnv(102);
            // const buddiRegion = Config.App.getNumber('imjs_buddi_resolve_url_using_region');
            // console.log("1A. buddi (with region) setting is => " + buddiRegion);
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
    //    UiItemsManager.register( new TestUiProvider());
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

    const openLabelSource = async (
        imodel: IModelConnection,
        accountName: string,
        sasString: string,
        projectGuid: string | undefined,
        imodelGuid: string | undefined,
        imodelName: string,
        revisionId: string,
        predSuffix: string,
    ) => {
         const config: BlobBasedLabelDataSourceConfig = {
            accountName: accountName,
            sasString: sasString,
            projectGuid: projectGuid as GuidString,
            imodelGuid: imodelGuid as GuidString,
            imodelName: imodelName,
            revisionId: revisionId,
            predSuffix: predSuffix
        }
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
        }
        catch (error) {}

        // console.log("Presentation initialized");

        const initPromises: Promise<void>[] = [];

        initPromises.push(SelectionExtender.initialize(LabelingApp.store, IModelApp.i18n, "selectionExtenderState"));
        initPromises.push(LabelingWorkflowManager.initialize(LabelingApp.store, IModelApp.i18n, "labelingWorkflowManagerState"));
        initPromises.push(IModelApp.i18n.registerNamespace("MachineLearning").readFinished);

        Promise.all(initPromises).then(
             () => { });
        console.log("All onIModelConnected initialization function promises have resolved.");

        const requestContext: AuthorizedFrontendRequestContext = await AuthorizedFrontendRequestContext.create();
        const changeSetQuery = new ChangeSetQuery();
        changeSetQuery.latest();
        const changesets = await IModelApp.iModelClient.changeSets.get(requestContext, process.env.IMJS_IMODEL_ID as string, changeSetQuery);

        var selection = {
            labelAccountName: "aiabcedeveussa01",
            labelSasString: "?sv=2019-12-12&ss=bf&srt=co&sp=rwdlacx&se=2022-12-31T23:12:51Z&st=2021-01-13T15:12:51Z&spr=https&sig=7fFOu%2FillaXETL2CGhWsEqFLavzCaCAsIILA%2FSsN8%2F8%3D",
            projectGuid: process.env.IMJS_CONTEXT_ID,
            iModelGuid: process.env.IMJS_IMODEL_ID,
            iModelName: "",
            changeSetId: "",
            predSuffix: "omni"
        };

        if (changesets.length !== 0) {
            selection.changeSetId = changesets[0].id!;
        }
        else {
            console.log("ChangeSet not found");
        }

        openLabelSource(
            connection,
            selection.labelAccountName,
            selection.labelSasString,
            selection.projectGuid,
            selection.iModelGuid,
            selection.iModelName!,
            selection.changeSetId,
            selection.predSuffix
        ).then(() => { });
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
                <span>"Logging in...."</span>
            ) : (
                isAuthorized && (
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
                        uiProviders={[new TestUiProvider()]}
                        onIModelConnected={onIModelConnected}
                        // onIModelAppInit={onIModelAppInit}
                    />
                )
            )}
        </div>
    );
};

export default App;
