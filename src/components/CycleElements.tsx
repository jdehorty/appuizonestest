import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, Icon, ButtonType,  Spinner, SpinnerSize, LabeledToggle, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import '../styles/LabelingWorkflowStyles.scss';
import MLStateTablePopout from "./MLStateTablePopout";

export interface CycleElementComponentProps {
    ready: boolean;
    enabled: boolean;
    working: boolean;
    cycleSetSize?: number;
    cycleIndex?: number;
    poppedOut?: boolean;
    totalCount: number;
    selectedCount: number;
    forceShowAll: boolean;

    onStart(): void;

    onStop(): void;

    onPopout(): void;

    onForward(count: number): void;

    onBackward(count: number): void;

    onForceShowAllChanged(forceShowAll: boolean): void;
}

interface CycleElementComponentState {
    readyForPopout: boolean;
}


export class CycleElementComponent extends React.Component<CycleElementComponentProps, CycleElementComponentState> {

    constructor(props: CycleElementComponentProps) {
        super(props);

        this.state = {
            readyForPopout: false
        };

        this._onPopoutButtonClick = this._onPopoutButtonClick.bind(this);

    }

    _onPopoutButtonClick = () => {
        this.setState({
            readyForPopout: true
        });
    }

    _onPopoutWindowClosing = () => {
        console.log("_onPopoutWindowClosing was fired");
        this.setState({
            readyForPopout: false,
        });
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
                <div className="sstc-data-header">
                    <table className="sstc-cycler-table">
                        <tbody>
                        <tr>
                            <td>
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
                            </td>
                            <td>
                                <Button className="sstc-window-new-button"
                                        buttonType={ButtonType.Hollow}
                                        onClick={this._onPopoutButtonClick}
                                >
                                    <Icon iconSpec="icon-window-new"/>
                                </Button>

                                {
                                    this.state.readyForPopout && <MLStateTablePopout title={"ML Audit"} closingPopout={this._onPopoutWindowClosing}/>
                                }
                            </td>

                        </tr>
                        </tbody>
                    </table>
                    <hr/>
                </div>
            </>
        );
    }

}

