import { BackstageAppButton, ContentGroup, ContentLayoutDef, ContentViewManager, CoreTools, Frontstage, FrontstageProvider, FrontstageProps, IModelViewportControl, ItemList, NavigationWidgetComposer, SelectionContextToolDefinitions, StagePanel, TileLoadingIndicator, ToolbarComposer, ToolbarHelper, ToolItemDef, ToolWidgetComposer, UiFramework, Widget, WidgetState, withStatusFieldProps, Zone, ZoneLocation, ZoneState } from "@bentley/ui-framework";
import { AbstractWidgetProps, BadgeType, CommonStatusBarItem, CommonToolbarItem, ConditionalBooleanValue, StagePanelLocation, StagePanelSection, StageUsage, ToolbarItemUtilities, ToolbarUsage, ToolbarOrientation, UiItemsProvider } from "@bentley/ui-abstract";
import { FillCentered } from "@bentley/ui-core";

import React from "react";

export class TestUiProvider implements UiItemsProvider {
  public readonly id = "TestUiProvider";

  public provideToolbarButtonItems(_stageId: string, stageUsage: string, toolbarUsage: ToolbarUsage, toolbarOrientation: ToolbarOrientation): CommonToolbarItem[] {

    if (stageUsage === StageUsage.General && toolbarUsage === ToolbarUsage.ContentManipulation && toolbarOrientation === ToolbarOrientation.Horizontal) {
      const simpleActionSpec = ToolbarItemUtilities.createActionButton("simple-test-action-tool", 200, "icon-developer", "simple-test-action-tool",
        (): void => {
          console.log("Got Here!");
        });

      //const isHiddenCondition = new ConditionalBooleanValue((): boolean => SampleAppIModelApp.getTestProperty() === "HIDE", [SampleAppUiActionId.setTestProperty]);
      const childActionSpec = ToolbarItemUtilities.createActionButton("child-test-action-tool", 210, "icon-developer", "child-test-action-tool",
        (): void => {
          console.log("Got Here!");
        }, { isHidden: false });

      const nestedActionSpec = ToolbarItemUtilities.createActionButton("nested-test-action-tool", 220, "icon-developer", "test action tool (nested)",
        (): void => {
          console.log("Got Here!");
        });
      const groupSpec = ToolbarItemUtilities.createGroupButton("test-tool-group", 230, "icon-developer", "test group", [childActionSpec, simpleActionSpec], { badgeType: BadgeType.TechnicalPreview, parentToolGroupId: "tool-formatting-setting" });

      return [simpleActionSpec, nestedActionSpec, groupSpec];
    }
    return [];
  }

  // public provideStatusBarItems(_stageId: string, stageUsage: string): CommonStatusBarItem[] {
  //   const statusBarItems: CommonStatusBarItem[] = [];
    // const ShadowToggle = withStatusFieldProps(ShadowField);

    // if (stageUsage === StageUsage.General) {
    //   statusBarItems.push(
    //     AbstractStatusBarItemUtilities.createActionItem("PluginTest:StatusBarItem1", StatusBarSection.Center, 100, "icon-developer", "test status bar from plugin",
    //       () => {
    //         console.log("Got Here!");
    //       }));

    //   const isHidden = new ConditionalBooleanValue(() => !SampleExtensionStateManager.isExtensionUiVisible, [SampleExtensionStateManager.SET_EXTENSION_UI_VISIBLE]);
    //   const statusBarItem = AbstractStatusBarItemUtilities.createLabelItem("PluginTest:StatusBarLabel1", StatusBarSection.Center, 100, "icon-hand-2", "Hello", undefined, { isHidden });
    //   statusBarItems.push(statusBarItem);

    //   const labelCondition = new ConditionalStringValue(() => SampleExtensionStateManager.isExtensionUiVisible ? "Click to Hide" : "Click to Show", [SampleExtensionStateManager.SET_EXTENSION_UI_VISIBLE]);
    //   const iconCondition = new ConditionalStringValue(() => SampleExtensionStateManager.isExtensionUiVisible ? "icon-visibility-hide-2" : "icon-visibility", [SampleExtensionStateManager.SET_EXTENSION_UI_VISIBLE]);

    //   statusBarItems.push(
    //     AbstractStatusBarItemUtilities.createActionItem("PluginTest:StatusBarItem2", StatusBarSection.Center, 110, iconCondition, labelCondition,
    //       () => {
    //         SampleExtensionStateManager.isExtensionUiVisible = !SampleExtensionStateManager.isExtensionUiVisible;
    //       }));

    //   // add entry that supplies react component
    //   statusBarItems.push(StatusBarItemUtilities.createStatusBarItem("ShadowToggle", StatusBarSection.Right, 5, <ShadowToggle />));
    // }
  //   return statusBarItems;
  // }

  // public provideWidgets(stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection | undefined): ReadonlyArray<AbstractWidgetProps> {
  //   const widgets: AbstractWidgetProps[] = [];
  //   console.log('location = ' + JSON.stringify(location));
  //   if (location === StagePanelLocation.Right) {
  //     console.log("setting up our custom widget");
  //     widgets.push({
  //       id: "addonWidget",
  //     getWidgetContent: () => <FillCentered>My Tool Settings</FillCentered>,
  //     });
  //   }
  //   return widgets;
  // }
}