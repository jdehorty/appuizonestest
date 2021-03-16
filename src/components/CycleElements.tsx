import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType, Icon, LabeledToggle, Spinner, SpinnerSize, SvgPath} from "@bentley/ui-core";
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
                                        <div
                                            className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.totalTitle")}</div>
                                        <div className="cycler-value">
                                            {this.props.ready && this.props.totalCount}
                                            {!this.props.ready && <Spinner size={SpinnerSize.Small}/>}
                                        </div>
                                    </div>
                                    <div className="cycler-selected-count">
                                        <div
                                            className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.selectedTitle")}</div>
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
                                            <Button className="cycler-button"
                                                    disabled={this.props.working || !this.props.ready}
                                                    style={{width: '24px', height: '22px'}}
                                                    onClick={() => this.props.onBackward(-fastCount)}>
                                                {/*<Icon iconSpec="icon-media-controls-fast-backward" />*/}
                                                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                    "m14.2222 4a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 " +
                                                    ".3874.6919v6.4a.80441.80441 0 0 1 -.3874.6919.75908.75908 0 0 1 " +
                                                    "-.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 0-1.3892l5.4444-3.2a.76069.76069 0 0 1 " +
                                                    ".3859-.1054zm-7 0a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 " +
                                                    ".3874.6919v6.4a.80441.80441 0 0 1 -.3874.6919.75908.75908 0 0 1 " +
                                                    "-.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 0-1.3892l5.4444-3.2a.76069.76069 0 0 1 .3859-.1054z"
                                                ]}
                                                />
                                            </Button>
                                            <Button className="cycler-button"
                                                    disabled={this.props.working || !this.props.ready}
                                                    style={{width: '24px', height: '22px'}}
                                                    onClick={() => this.props.onBackward(-1)}>
                                                {/* <Icon iconSpec="icon-media-controls-frame-backward" /> */}
                                                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                    "m9.2222 4a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 .3874.6919v6.4a.80441.80441 0 0 1" +
                                                    " -.3874.6919.75908.75908 0 0 1 -.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 " +
                                                    "0-1.3892l5.4444-3.2a.76069.76069 0 0 1 .3859-.1054zm2.7778-1a1 1 0 0 1 1 " +
                                                    "1v8a1 1 0 0 1 -1 1 1 1 0 0 1 -1-1v-8a1 1 0 0 1 1-1z"
                                                ]}
                                                />
                                            </Button>
                                            <div className="cycler-progress">
                                                <div
                                                    className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.cyclingTitle")}</div>
                                                <div className="cycler-value">
                                                    {this.props.cycleIndex !== undefined && <>
                                                        {`${this.props.cycleIndex! + 1}`}
                                                        &nbsp;/&nbsp;
                                                    </>}
                                                    {`${this.props.cycleSetSize!}`}
                                                </div>
                                            </div>
                                            <Button className="cycler-button"
                                                    disabled={this.props.working || !this.props.ready}
                                                    style={{width: '24px', height: '22px'}}
                                                    onClick={() => this.props.onForward(1)}>
                                                {/* <Icon iconSpec="icon-media-controls-frame-forward"/> */}
                                                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                    "m6.7778 4a.76016.76016 0 0 0 -.3904.1081.80441.80441 0 0 0 -.3874.6919v6.4a.80441.80441 0 0 0 " +
                                                    ".3874.6919.75908.75908 0 0 0 .7763.0027l5.4444-3.2a.8115.8115 0 0 0 " +
                                                    "0-1.3892l-5.4444-3.2a.76069.76069 0 0 0 -.3859-.1054zm-2.7778-1a1 1 0 0 0 " +
                                                    "-1 1v8a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1z"
                                                ]}
                                                />

                                            </Button>
                                            <Button className="cycler-button"
                                                    disabled={this.props.working || !this.props.ready}
                                                    style={{width: '24px', height: '22px'}}
                                                    onClick={() => this.props.onForward(fastCount)}>
                                                {/*<Icon iconSpec="icon-media-controls-fast-forward" />*/}
                                                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                    "m1.7778 4a.76016.76016 0 0 0 -.3904.1081.80441.80441 0 0 0 -.3874.6919v6.4a.80441.80441 0 0 0 " +
                                                    ".3874.6919.75908.75908 0 0 0 .7763.0027l5.4444-3.2a.8115.8115 0 0 0 0-1.3892l-5.4444-3.2a.76069.76069 " +
                                                    "0 0 0 -.3859-.1054zm7 0a.76016.76016 0 0 0 -.3904.1081.80441.80441 0 0 0 -.3874.6919v6.4a.80441.80441 0 0 0 " +
                                                    ".3874.6919.75908.75908 0 0 0 .7763.0027l5.4444-3.2a.8115.8115 0 0 0 0-1.3892l-5.4444-3.2a.76069.76069 0 0 0 " +
                                                    "-.3859-.1054z"
                                                ]}
                                                />
                                            </Button>
                                            <Button className="cycler-button"
                                                    disabled={this.props.working || !this.props.ready}
                                                    style={{width: '24px', height: '22px'}}
                                                    onClick={this.props.onStop}>
                                                {/*<Icon iconSpec="icon-media-controls-stop" /> */}
                                                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                    "m12 3h-8a1 1 0 0 0 -1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1z"
                                                ]}
                                                />
                                            </Button>
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
                            {!this.props.poppedOut &&
                            <td>

                                <Button className="sstc-window-new-button"
                                        buttonType={ButtonType.Hollow}
                                        onClick={this._onPopoutButtonClick}
                                >
                                    <Icon iconSpec="icon-window-new"/>
                                </Button>

                                {
                                    this.state.readyForPopout &&
                                    <MLStateTablePopout title={"ML Audit"} closingPopout={this._onPopoutWindowClosing}/>
                                }
                            </td>
                            }
                        </tr>
                        </tbody>
                    </table>
                    <hr/>
                </div>
            </>
        );
    }

}

