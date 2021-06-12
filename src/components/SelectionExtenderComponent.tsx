/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { Id64String } from "@bentley/bentleyjs-core";
import { Environment, IModelApp, IModelConnection, ViewState3d } from "@bentley/imodeljs-frontend";
import { Button, ButtonType, LabeledInput, LabeledSelect, LabeledToggle, Textarea } from "@bentley/ui-core";
import * as React from "react";
import { MatchingOperator, MatchingRuleType, SelectionExtenderConfig } from "../store/SelectionExtenderTypes";
import { NumberInputComponent } from "./NumberInputComponent";
import "../styles/components/_SelectionExtenderComponent.scss";
import { UiFramework } from "@bentley/ui-framework";
import { SelectionExtender } from "../SelectionExtender";

export type SelectionExtenderComponentProps = {
    singleId?: Id64String;
    contentMap?: Map<MatchingRuleType, string[]>;
    foundCount?: number;
    isSearching?: boolean;
    config?: SelectionExtenderConfig;

    onConfigChanged(newConfig: SelectionExtenderConfig): void;

    onExtendClicked(): void;

    onResetClicked(): void;
}


export const SelectionExtenderComponent = (props: SelectionExtenderComponentProps) => {
    let vpCount = 0;

    let vp = IModelApp.viewManager.getFirstOpenView();

    if (vp?.view.is3d()) {
        const view: ViewState3d = vp.view;
        console.log('view is: ' + view === null ? "null" : "not null");

        let displayStyle = view.getDisplayStyle3d();
        let props = displayStyle.environment.sky.toJSON();

        props.groundColor = -1;
        props.nadirColor = -1;
        props.skyColor = -1;
        props.zenithColor = -1;

        displayStyle.environment = new Environment({ sky: props });
        vp.displayStyle = displayStyle;
        vp.synchWithView();
    }

const handleFieldCheckboxClicked = (i: number) => (): void => {
    if (props.config === undefined) {
        return;
    }
    const newChildRules = Array.from(props.config.rule.childRules);
    newChildRules[i].wanted = !newChildRules[i].wanted;
    props.onConfigChanged({
        ...props.config,
        rule: {
            ...props.config.rule,
            childRules: newChildRules,
        }
    });
};

const handleMaxDistEnabledClicked = (checked: boolean): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        maxDistEnabled: checked,
    });
};

const handleMaxDistValueValidated = (value: number): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        maxDistValue: value,
    });
}

const handleMaxCountEnabledClicked = (checked: boolean): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        maxCountEnabled: checked,
    });
};

const handleMaxCountValueValidated = (value: number): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        maxCountValue: value,
    });
}

const handleAuxDataClicked = (checked: boolean): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        enableAuxData: checked,
    });
};

const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    if (props.config === undefined) {
        return;
    }
    props.onConfigChanged({
        ...props.config,
        rule: {
            ...props.config.rule,
            operator: event.target.value as MatchingOperator,
        }
    });
}

// create list of checkboxes
const checkboxElements: JSX.Element[] = [];
if (props.config !== undefined) {
    const childRules = props.config.rule.childRules;
    for (let i = 0; i < childRules.length; i++) {
        if (props.contentMap!.has(childRules[i].type)) {
            const content = props.contentMap!.get(childRules[i].type)!;
            checkboxElements.push(
                <div key={`childRule-${i}`} className="selhelp-criteria">
                    <div className="selhelp-criteria-checkbox-container">
                        <input className="selhelp-criteria-checkbox" type="checkbox"
                               checked={childRules[i].wanted} onClick={handleFieldCheckboxClicked(i)}/>
                    </div>
                    <div className="selhelp-criteria-content">
                        <div className="selhelp-criteria-title">
                            {IModelApp.i18n.translate(childRules[i].type)}
                        </div>
                        {content.map((value: string) => {
                            return <>
                                <div className="selhelp-criteria-value">
                                    {value}
                                </div>
                            </>
                        })}
                    </div>
                </div>
            );
        }
    }
}

return (

    <>
        {props.isSearching && "Searching..."}
        {props.foundCount !== undefined && !props.isSearching && `Found ${props.foundCount} elements`}

        <LabeledInput
            readOnly label="Select Elements Similar to Id:"
            value={props.singleId !== undefined ? props.singleId : ""}
        />

        <div>
            <Button
                buttonType={ButtonType.Primary}
                onClick={props.onExtendClicked}>
                Extend Selection
            </Button>

            <Button
                buttonType={ButtonType.Blue}
                onClick={props.onResetClicked}>
                Reset
            </Button>
        </div>

        {props.config !== undefined && <div className="scroll-thing">
            <LabeledToggle
                isOn={props.config.enableAuxData}
                label="Mesh-Derived Data"
                onChange={handleAuxDataClicked}
            />
            <LabeledToggle
                isOn={props.config.maxDistEnabled}
                label="Maximum Distance"
                onChange={handleMaxDistEnabledClicked}
            />
            {
                props.config.maxDistEnabled &&
                <NumberInputComponent
                    isFloat={true}
                    value={props.config.maxDistValue}
                    minValue={0.0}
                    onValidated={handleMaxDistValueValidated}
                />
            }
            <LabeledToggle
                isOn={props.config.maxCountEnabled}
                label="Maximum Count"
                onChange={handleMaxCountEnabledClicked}
            />
            {
                props.config.maxCountEnabled &&
                <NumberInputComponent
                    isFloat={false}
                    value={props.config.maxCountValue}
                    minValue={1}
                    onValidated={handleMaxCountValueValidated}
                />
            }

            {checkboxElements}

            <LabeledSelect
                label="Reduction Operator"
                // TODO: make this safer
                options={[MatchingOperator.And, MatchingOperator.Or]}
                value={props.config.rule.operator}
                onChange={handleOperatorChange}
            />

            <Textarea
                onKeyDown={async (event: React.KeyboardEvent<HTMLElement>) => {

                    const addElementsToSelection = async (imodel: IModelConnection, elementIds: string) => {
                        const elementsAsList = elementIds.split(",")
                        const className = elementsAsList[0].replace('.', ':');
                        await SelectionExtender.manualSelection(className, elementsAsList.slice(1))
                    };

                    const onInputEntered = async (event: React.KeyboardEvent<HTMLElement>) => {
                        const value = (event.target as any).value.trim();
                        const imodel = UiFramework.getIModelConnection()!;
                        await addElementsToSelection(imodel, value);
                    };

                    if (event.key.toLowerCase() === "enter") {
                        await onInputEntered(event);
                    }

                }}
            />

        </div>}

        {props.config === undefined && "Loading..."}
    </>
)
}
;

export default SelectionExtenderComponent;