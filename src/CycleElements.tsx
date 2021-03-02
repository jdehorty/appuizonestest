/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

import { IModelApp } from "@bentley/imodeljs-frontend";
import { Button, Icon, Spinner, SpinnerSize, LabeledToggle } from "@bentley/ui-core";
import * as React from "react";
import '../LabelingWorkflowStyles.scss';


export interface CycleElementComponentProps {
    ready: boolean;
    enabled: boolean;
    working: boolean;
    cycleSetSize?: number;
    cycleIndex?: number;
    totalCount: number;
    selectedCount: number;
    forceShowAll: boolean;
    onStart(): void;
    onStop(): void;
    onForward(count: number): void;
    onBackward(count: number): void;
    onForceShowAllChanged(forceShowAll: boolean): void;
}

interface CycleElementComponentState {

}


export class CycleElementComponent extends React.Component<CycleElementComponentProps, CycleElementComponentState> {

    constructor(props: CycleElementComponentProps) {
        super(props);

        this.state = {
        };

    }


    public render() {

        let fastCount = 1;
        if (this.props.cycleSetSize !== undefined) {
            fastCount = Math.round(this.props.cycleSetSize / 10);
            if (fastCount < 1) {
                fastCount = 1;
            }
        }

        return (
            <>
                <div className="cycler-container">
                    <div className="cycler-total-count">
                        <div className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.totalTitle")}</div>
                        <div className="cycler-value">
                            {this.props.ready && this.props.totalCount}
                            {!this.props.ready && <Spinner size={SpinnerSize.Small}/>}
                        </div>
                    </div>
                    <div className="cycler-selected-count">
                        <div className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.selectedTitle")}</div>
                        <div className="cycler-value">
                            {this.props.ready && this.props.selectedCount}
                            {!this.props.ready && <Spinner size={SpinnerSize.Small}/>}
                        </div>
                    </div>
                    {
                        !this.props.enabled &&
                        <>
                            <Button
                                className="cycler-button"
                                onClick={this.props.onStart}
                                disabled={this.props.selectedCount === 0 || !this.props.ready}
                            >
                                {IModelApp.i18n.translate("LabelingApp:cycler.startCycling")}
                            </Button>
                        </>
                    }
                    {
                        this.props.enabled &&
                        <>
                            <Button className="cycler-button" disabled={this.props.working || !this.props.ready} onClick={()=>this.props.onBackward(-fastCount)}><Icon iconSpec="icon-media-controls-fast-backward" /></Button>
                            <Button className="cycler-button" disabled={this.props.working || !this.props.ready} onClick={()=>this.props.onBackward(-1)}><Icon iconSpec="icon-media-controls-frame-backward" /></Button>
                            <div className="cycler-progress">
                                <div className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.cyclingTitle")}</div>
                                <div className="cycler-value">
                                    {this.props.cycleIndex !== undefined && <>
                                        {`${this.props.cycleIndex! + 1}`}
                                        &nbsp;/&nbsp;
                                    </>}
                                    {`${this.props.cycleSetSize!}`}
                                </div>
                            </div>
                            <Button className="cycler-button" disabled={this.props.working || !this.props.ready} onClick={()=>this.props.onForward(1)}><Icon iconSpec="icon-media-controls-frame-forward" /></Button>
                            <Button className="cycler-button" disabled={this.props.working || !this.props.ready} onClick={()=>this.props.onForward(fastCount)}><Icon iconSpec="icon-media-controls-fast-forward" /></Button>
                            <Button className="cycler-button" disabled={this.props.working || !this.props.ready} onClick={this.props.onStop}><Icon iconSpec="icon-media-controls-stop" /></Button>
                        </>
                    }
                    &nbsp;
                    <LabeledToggle 
                        label={IModelApp.i18n.translate("LabelingApp:forceShowAll")} 
                        isOn={this.props.forceShowAll} 
                        onChange={this.props.onForceShowAllChanged} 
                    />
                </div>
            </>
        );
    }

}

