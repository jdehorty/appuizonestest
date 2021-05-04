/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
    AbstractWidgetProps,
    StagePanelLocation,
    StagePanelSection,
    UiItemsProvider,
} from "@bentley/ui-abstract";

import React from "react";

import {ConnectedSelectionHelperComponent} from "./SelectionExtender";
import {ConnectedMLTableComponent} from "./components/ConnectedMLTable";

import {Provider} from 'react-redux';
import {LabelerState} from "./store/LabelerState";
import {ConnectedCycleElementComponent} from "./components/ConnectedCycleElements";
import {ConnectedLabelTableAllComponent} from "./components/MLTable/ConnectedLabelTableAllComponent";


export class LabelerUiProvider implements UiItemsProvider {
    public readonly id = "LabelerUiProvider";

    public provideWidgets(stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection | undefined): ReadonlyArray<AbstractWidgetProps> {
        const widgets: AbstractWidgetProps[] = [];
        if (stageId === "DefaultFrontstage") {
            if (location === StagePanelLocation.Right) {
                widgets.push({
                    id: "selectionExtenderId",
                    label: "Selection Extender",
                    getWidgetContent: () =>
                        <Provider store={LabelerState.store}>
                            <ConnectedSelectionHelperComponent/>
                        </Provider>
                });
            }
            // Old Interface (keep for reference)
//            if (location === StagePanelLocation.Bottom) {
//                widgets.push({
//                    id: "MLLabelingToolId",
//                    label: "ML Labeling Tool",
//                    getWidgetContent: () =>
//                        <Provider store={LabelerState.store}>
//                            <ConnectedCycleElementComponent />
//                            <ConnectedMLTableComponent />
//                        </Provider>
//                });
//            }
            if (location === StagePanelLocation.Left) {
                widgets.push({
                    id: "MLLabelingToolV2Id",
                    label: "ML Labeling Tool",
                    getWidgetContent: () =>
                        <Provider store={LabelerState.store}>
                            <ConnectedCycleElementComponent />
                            <ConnectedLabelTableAllComponent />
                        </Provider>
                });
            }
        }
        return widgets;
    }
}
