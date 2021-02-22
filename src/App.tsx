import "./App.scss";

import {Viewer} from "@bentley/itwin-viewer-react";
import React, {useEffect, useState} from "react";

import AuthorizationClient from "./AuthorizationClient";
import {Header} from "./Header";
import {TestUiProvider} from "./TestUiProvider";

// import { UiItemsManager } from "@bentley/ui-abstract";
// import { TestUiProvider } from "./sampleFrontstageProvider";


const App: React.FC = () => {
    console.log("useState #1");
    const [isAuthorized, setIsAuthorized] = useState(
        AuthorizationClient.oidcClient
            ? AuthorizationClient.oidcClient.isAuthorized
            : false
    );
    console.log("useState #2");
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        console.log("useEffect #1");
        const initOidc = async () => {
            if (!AuthorizationClient.oidcClient) {
                await AuthorizationClient.initializeOidc();
            }

            try {
                // attempt silent signin
                await AuthorizationClient.signInSilent();
                console.log("setting IsAuthorized flag to => " + AuthorizationClient.oidcClient.isAuthorized);
                setIsAuthorized(AuthorizationClient.oidcClient.isAuthorized);
            } catch (error) {
                console.log("ERROR: useEffect #1, during oidc initialization");
            }
        };
        initOidc().catch((error) => console.error(error));
        console.log("ue1.A Completed oidc.Init");
        console.log("ue1.B sLoggingIn => " + isLoggingIn);
        console.log("ue1.C isAuthorized => " + isAuthorized);
    }, []);

    useEffect(() => {
        console.log("useEffect #2");
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
        console.log("useEffect #3");
        if (isLoggingIn && isAuthorized) {
            setIsLoggingIn(false);
        }
    }, [isAuthorized, isLoggingIn]);

    useEffect(() => {
        console.log("useEffect #4");
        console.log("ue4.B sLoggingIn => " + isLoggingIn);
        console.log("ue4.C isAuthorized => " + isAuthorized);
    }, [isAuthorized, isLoggingIn]);

    // useEffect (() => {
    //    UiItemsManager.register( new TestUiProvider());
    // }, []);

    const onLoginClick = async () => {
        
        setIsLoggingIn(true);
        await AuthorizationClient.signIn();
        console.log("onLoginClick complete");
    };

    const onLogoutClick = async () => {
        console.log("onLogoutClick");
        setIsLoggingIn(false);
        await AuthorizationClient.signOut();
        setIsAuthorized(false);
    };

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
                        theme={"dark"}
                        defaultUiConfig={
                            {
                                hideToolSettings: false,
                                hideTreeView: false,
                            }
                        }
                        uiProviders={[new TestUiProvider()]}
                    />
                )
            )}
        </div>
    );
};

export default App;
