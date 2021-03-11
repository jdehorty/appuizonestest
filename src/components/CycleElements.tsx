import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, Icon, ButtonType, SvgPath} from "@bentley/ui-core";
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
    readyForPopup: boolean;
}


export class CycleElementComponent extends React.Component<CycleElementComponentProps, CycleElementComponentState> {

    constructor(props: CycleElementComponentProps) {
        super(props);

        this.state = {
            readyForPopup: false
        };

        this._onPopoutButtonClick = this._onPopoutButtonClick.bind(this);

    }

    _onPopoutButtonClick = () => {
        this.setState({
            readyForPopup: true
        });
    }

    _onPopoutWindowClosing = () => {
        console.log("_onPopoutWindowClosing was fired");
        this.setState({
            readyForPopup: false,
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
                                <Button
                                    className="sstc-isolate-button"
                                    buttonType={ButtonType.Hollow}
                                    style={{minWidth:24, maxWidth:24}}
                                >
                                    {/*<Icon iconSpec="icon-isolate"/>*/}
                                    <SvgPath viewBoxWidth={16} viewBoxHeight={16}  paths={[
                                        "M2,9h6v6H2",
                                        "M2,1v6h6V1H2z M7,6H3V2h4V6z",
                                        "m10 1v6h6v-6h-6m5 5h-4v-4h4v4",
                                        "m10 9v6h6v-6m-1 5h-4v-4h4"
                                    ]}/>
                                </Button>
                            </td>
                            <td>
                                <div className="vertical-rule"/>
                            </td>

                            <td>
                                <Button className="cycler-button" disabled={this.props.working || !this.props.ready}
                                        style = {{minWidth: 26, maxWidth: 28}}
                                        onClick={() => this.props.onBackward(-1)}>
                                    {/*<Icon iconSpec="icon-media-controls-frame-backward"/>*/}
                                    <SvgPath viewBoxWidth={16} viewBoxHeight={16}  paths={[
                                        "m9.2222 4a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 .3874.6919v6.4a.80441" +
                                        ".80441 0 0 1 -.3874.6919.75908.75908 0 0 1 -.7763.0027l-5.4444-3.2a.8115.8115 0" +
                                        " 0 1 0-1.3892l5.4444-3.2a.76069.76069 0 0 1 .3859-.1054zm2.7778-1a1 1 0 0 1 1 1" +
                                        "v8a1 1 0 0 1 -1 1 1 1 0 0 1 -1-1v-8a1 1 0 0 1 1-1z"
                                    ]}/>
                                </Button>

                                <Button className="cycler-previous" buttonType={ButtonType.Hollow}>
                                    Previous
                                </Button>
                            </td>

                            {/*TODO: Get counter working again */}
                            <td>
                                <div className="cycler-progress">
                                    <div
                                        className="cycler-title">{IModelApp.i18n.translate("LabelerState:cycler.cyclingTitle")}</div>
                                    <div className="cycler-value">
                                        {this.props.cycleIndex !== undefined && <>
                                            {`${this.props.cycleIndex! + 1}`}
                                            &nbsp;/&nbsp;
                                        </>}
                                        {`${this.props.cycleSetSize!}`}
                                    </div>
                                </div>
                            </td>

                            <td>
                                <Button className="cycler-next" buttonType={ButtonType.Hollow}>
                                    Next
                                </Button>
                                <Button className="cycler-button"
                                        disabled={this.props.working || !this.props.ready}
                                        style={{minWidth: 26, maxWidth: 28}}
                                        onClick={() => this.props.onForward(1)}>
                                    {/*<Icon iconSpec="icon-media-controls-frame-forward"/>*/}
                                    <SvgPath viewBoxWidth={16} viewBoxHeight={16}  paths={[
                                        "m6.7778 4a.76016.76016 0 0 0 -.3904.1081.80441.80441 0 0 0 -.3874.6919v6.4a.804" +
                                        "41.80441 0 0 0 .3874.6919.75908.75908 0 0 0 .7763.0027l5.4444-3.2a.8115.8115 0 " +
                                        "0 0 0-1.3892l-5.4444-3.2a.76069.76069 0 0 0 -.3859-.1054zm-2.7778-1a1 1 0 0 0 " +
                                        "-1 1v8a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1z"
                                    ]}/>
                                </Button>
                            </td>

                            <td>
                                <div className="vertical-rule"/>
                            </td>
                            <td>
                                <Button className="sstc-window-new-button"
                                        buttonType={ButtonType.Hollow}
                                        onClick={this._onPopoutButtonClick}
                                >
                                    <Icon iconSpec="icon-window-new"/>
                                </Button>

                                {
                                    this.state.readyForPopup && <MLStateTablePopout title={"ML Audit"} closingPopout={this._onPopoutWindowClosing}/>
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

