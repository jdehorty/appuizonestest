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
import {ConnectedSelectionHelperComponent} from "./SelectionExtender2";
import {Provider} from 'react-redux';
import {LabelingApp} from "./LabelingApp";


export class TestUiProvider implements UiItemsProvider {
    public readonly id = "TestUiProvider";

    public provideWidgets(
        stageId: string,
        _stageUsage: string,
        location: StagePanelLocation,
        _section?: StagePanelSection | undefined
    ): ReadonlyArray<AbstractWidgetProps> {
        const widgets: AbstractWidgetProps[] = [];
        if (stageId === "DefaultFrontstage") {
            if (location === StagePanelLocation.Right) {
                widgets.push({
                    id: "addonWidget",
                    label: "Labeler",
                    getWidgetContent: () =>
                        <Provider store={LabelingApp.store}>
                            <ConnectedSelectionHelperComponent/>
                        </Provider>
                });
            }
        }
        return widgets;
    }
}
