/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { SelectionScopeField, StatusBarRightSection, StatusBarSpaceBetween, StatusBarWidgetControl, StatusBarWidgetControlArgs } from "@bentley/ui-framework";
import * as React from "react";
import { Provider } from "react-redux";
import { LabelingApp } from "./LabelingApp";
import { ConnectedCycleElementComponent } from "./ConnectedCycleElements";

// import { CycleElementComponent } from "../components/selection-extender-component/CycleElementComponent";

/**
 * Status Bar example widget
 */
export class AppStatusBarWidgetControl extends StatusBarWidgetControl {
  // constructor(info: ConfigurableCreateInfo, options: any) {
  //   super(info, options);
  // }

  public getReactNode(controlArgs: StatusBarWidgetControlArgs): React.ReactNode {
    const { isInFooterMode, onOpenWidget, openWidget, toastTargetRef } = controlArgs;

    return (
      <StatusBarSpaceBetween>
        <StatusBarRightSection>
          <Provider store={LabelingApp.store} >
            <ConnectedCycleElementComponent />
          </Provider>
        </StatusBarRightSection>
      </StatusBarSpaceBetween>
    );
  }
}
