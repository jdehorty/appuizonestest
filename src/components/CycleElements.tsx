/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import React, {FC, useState} from 'react';
import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType, Icon, LabeledToggle, Spinner, SpinnerSize, SvgPath} from "@bentley/ui-core";
import MLStateTablePopout from "./MLStateTablePopout";
import "../styles/_LabelingWorkflowStyles.scss";


export interface CycleElementComponentProps {
    ready: boolean;
    enabled: boolean;
    working: boolean;
    cycleSetSize?: number;
    cycleIndex?: number;
    totalCount: number;
    selectedCount: number;
    forceShowAll: boolean;
    isPoppedOut: boolean;
    readyForPopout: boolean;

    onStart(): void;

    onStop(): void;

    onPopout(): void;

    onForward(count: number): void;

    onBackward(count: number): void;

    onForceShowAllChanged(forceShowAll: boolean): void;
}

export const CycleElementComponent: FC<CycleElementComponentProps> = (props) => {

    const [readyForPopout, setReadyForPopout] = useState<boolean>(props.readyForPopout);

    const _onPopoutButtonClick = () => {
        setReadyForPopout(true);
    }

    const _onPopoutWindowClosing = () => {
        setReadyForPopout(false);
    }

    let fastCount = 1;
    if (props.cycleSetSize !== undefined) {
        fastCount = Math.round(props.cycleSetSize / 10);
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
                                        {props.ready && props.totalCount}
                                        {!props.ready && <Spinner size={SpinnerSize.Small}/>}
                                    </div>
                                </div>
                                <div className="cycler-selected-count">
                                    <div
                                        className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.selectedTitle")}</div>
                                    <div className="cycler-value">
                                        {props.ready && props.selectedCount}
                                        {!props.ready && <Spinner size={SpinnerSize.Small}/>}
                                    </div>
                                </div>
                                {
                                    !props.enabled &&
                                    <>
                                        <Button
                                            className="cycler-button"
                                            onClick={props.onStart}
                                            disabled={props.selectedCount === 0 || !props.ready}
                                        >
                                            {IModelApp.i18n.translate("LabelingApp:cycler.startCycling")}
                                        </Button>
                                    </>
                                }
                                {
                                    props.enabled &&
                                    <>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{width: '24px', height: '22px'}}
                                                onClick={() => props.onBackward(-fastCount)}>
                                            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                "m14.2222 4a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 " +
                                                ".3874.6919v6.4a.80441.80441 0 0 1 -.3874.6919.75908.75908 0 0 1 " +
                                                "-.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 0-1.3892l5.4444-3.2a.76069.76069 0 0 1 " +
                                                ".3859-.1054zm-7 0a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 " +
                                                ".3874.6919v6.4a.80441.80441 0 0 1 -.3874.6919.75908.75908 0 0 1 " +
                                                "-.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 0-1.3892l5.4444-3.2a.76069.76069 0 0 1 .3859-.1054z"]}
                                            />
                                        </Button>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{width: '24px', height: '22px'}}
                                                onClick={() => props.onBackward(-1)}>
                                            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                "m9.2222 4a.76016.76016 0 0 1 .3904.1081.80441.80441 0 0 1 .3874.6919v6.4a.80441.80441 0 0 1" +
                                                " -.3874.6919.75908.75908 0 0 1 -.7763.0027l-5.4444-3.2a.8115.8115 0 0 1 " +
                                                "0-1.3892l5.4444-3.2a.76069.76069 0 0 1 .3859-.1054zm2.7778-1a1 1 0 0 1 1 " +
                                                "1v8a1 1 0 0 1 -1 1 1 1 0 0 1 -1-1v-8a1 1 0 0 1 1-1z"]}
                                            />
                                        </Button>
                                        <div className="cycler-progress">
                                            <div
                                                className="cycler-title">{IModelApp.i18n.translate("LabelingApp:cycler.cyclingTitle")}</div>
                                            <div className="cycler-value">
                                                {props.cycleIndex !== undefined && <>
                                                    {`${props.cycleIndex! + 1}`}
                                                    &nbsp;/&nbsp;
                                                </>}
                                                {`${props.cycleSetSize!}`}
                                            </div>
                                        </div>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{width: '24px', height: '22px'}}
                                                onClick={() => props.onForward(1)}>
                                            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                                                "m6.7778 4a.76016.76016 0 0 0 -.3904.1081.80441.80441 0 0 0 -.3874.6919v6.4a.80441.80441 0 0 0 " +
                                                ".3874.6919.75908.75908 0 0 0 .7763.0027l5.4444-3.2a.8115.8115 0 0 0 " +
                                                "0-1.3892l-5.4444-3.2a.76069.76069 0 0 0 -.3859-.1054zm-2.7778-1a1 1 0 0 0 " +
                                                "-1 1v8a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-8a1 1 0 0 0 -1-1z"]}
                                            />

                                        </Button>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{width: '24px', height: '22px'}}
                                                onClick={() => props.onForward(fastCount)}>
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
                                                disabled={props.working || !props.ready}
                                                style={{width: '24px', height: '22px'}}
                                                onClick={props.onStop}>
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
                                    isOn={props.forceShowAll}
                                    onChange={props.onForceShowAllChanged}
                                />
                            </div>
                        </td>
                        {
                            !props.isPoppedOut &&
                            <td className="mltc-popout-button-td">
                                <div>
                                    <Button
                                        className="sstc-window-new-button"
                                        buttonType={ButtonType.Hollow}
                                        onClick={_onPopoutButtonClick}
                                    >
                                        <Icon iconSpec="icon-window-new"/>
                                    </Button>
                                    {
                                        readyForPopout &&
                                        <MLStateTablePopout
                                            title={"ML Labeler"}
                                            closingPopout={_onPopoutWindowClosing}/>
                                    }
                                </div>
                            </td>
                        }
                    </tr>
                    </tbody>
                </table>
                <hr/>
            </div>
        </>
    );
};