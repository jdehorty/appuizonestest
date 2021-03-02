/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import {
    AbstractWidgetProps, CommonStatusBarItem,
    StagePanelLocation,
    StagePanelSection, StageUsage, StatusBarSection,
    UiItemsProvider,
} from "@bentley/ui-abstract";

import React from "react";

import {ConnectedSelectionHelperComponent, SelectionExtender} from "./SelectionExtender2";
import {ConnectedMLTableComponent} from "./ConnectedMLTable";

import {Provider} from 'react-redux';
import {LabelingApp} from "./LabelingApp";
import {ConnectedCycleElementComponent} from "./ConnectedCycleElements";


export class TestUiProvider implements UiItemsProvider {
    public readonly id = "TestUiProvider";

    public provideWidgets(stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection | undefined): ReadonlyArray<AbstractWidgetProps> {
        const widgets: AbstractWidgetProps[] = [];
        if (stageId === "DefaultFrontstage") {
            if (location === StagePanelLocation.Right) {
                widgets.push({
                    id: "selectionExtenderId",
                    label: "Selection Extender",
                    getWidgetContent: () =>
                        <Provider store={LabelingApp.store}>
                            <ConnectedSelectionHelperComponent/>
                        </Provider>
                });
            }
            if (location === StagePanelLocation.Bottom) {
                widgets.push({
                    id: "MLAuditId",
                    label: "ML Audit",
                    getWidgetContent: () =>
                        <Provider store={LabelingApp.store}>
                            <ConnectedCycleElementComponent />
                            <ConnectedMLTableComponent />
                        </Provider>
                });
            }
            // if (location === StagePanelLocation.Bottom) {
            //     widgets.push({
            //         id: "Cycler",
            //         label: "Cycler",
            //         getWidgetContent: () =>
            //             <Provider store={LabelingApp.store}>
            //                 AppStatusBarWidgetControl
            //             </Provider>
            //     });
            // }
        }
        return widgets;
    }

    // public provideStatusBarItems(
    //     _stageId: string,
    //     stageUsage: string
    // ): CommonStatusBarItem[] {
    //     const statusBarItems: CommonStatusBarItem[] = [];
    //
    //     if (stageUsage === StageUsage.General) {
    //         statusBarItems.push(
    //             AbstractStatusBarItemUtilities.createActionItem(
    //                 "alert-statusbar-item",
    //                 StatusBarSection.Left,
    //                 100,
    //                 "icon-developer",
    //                 "Status bar item test",
    //                 () => {
    //                     alert("Status Bar Item Clicked!");
    //                 }
    //             )
    //         );
    //     }
    //
    //     return statusBarItems;
    // }
}
