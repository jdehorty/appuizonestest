import "./index.scss";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {LabelingApp} from "./LabelingApp";

import { SetupConfigEnv } from './common/configuration/configuration';

// configure environment --> relocated to .env file
// SetupConfigEnv(0); // PROD
// SetupConfigEnv(102); // QA
// SetupConfigEnv(103); // DEV

// App startup
LabelingApp.startup();
console.log("Completed LabelingApp.startup");

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
