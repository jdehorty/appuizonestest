/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import React, { FC, useState } from 'react';
import { IModelApp } from "@bentley/imodeljs-frontend";
import { Button, ButtonType, LabeledToggle, Spinner, SpinnerSize } from "@bentley/ui-core";
import { CyclerButtonBackFastSvg } from "./CyclerButtonBackFastSvg";
import { CyclerButtonBackSvg } from "./CyclerButtonBackSvg";
import { CyclerButtonForwardSvg } from "./CyclerButtonForwardSvg";
import { CyclerButtonForwardFastSvg } from "./CyclerButtonForwardFastSvg";
import { CycleElementsPlaySvg } from "./CycleElementsPlaySvg";
import { IsolateButton } from "./IsolateButton";


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
                        <td width="95%">
                            <div className="cycler-container">
                                {
                                    (props.selectedCount > 0) && !props.enabled &&
                                    <Button
                                        className="cycler-button"
                                        buttonType={ButtonType.Hollow}
                                        onClick={props.onStart}
                                        style={{ minWidth: 24, maxWidth: 24 }}
                                    >
                                        <IsolateButton
                                            isDisabled={false}
                                        />
                                    </Button>
                                }
                                {/*{*/}
                                {/*    (props.selectedCount <= 0) && !props.enabled &&*/}
                                {/*    <Button*/}
                                {/*        className="cycler-button"*/}
                                {/*        buttonType={ButtonType.Hollow}*/}
                                {/*        onClick={props.onStart}*/}
                                {/*        style={{ minWidth: 24, maxWidth: 24 }}*/}
                                {/*    >*/}
                                {/*        <IsolateButton*/}
                                {/*            isDisabled={true}*/}
                                {/*        />*/}
                                {/*    </Button>*/}
                                {/*}*/}
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
                                    props.enabled &&
                                    <>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{ width: '24px', height: '22px' }}
                                                onClick={() => props.onBackward(fastCount)}>
                                            <CyclerButtonBackFastSvg/>
                                        </Button>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{ width: '24px', height: '22px' }}
                                                onClick={() => props.onBackward(1)}>
                                            <CyclerButtonBackSvg/>
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
                                                style={{ width: '24px', height: '22px' }}
                                                onClick={() => props.onForward(1)}>
                                            <CyclerButtonForwardSvg/>

                                        </Button>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{ width: '24px', height: '22px' }}
                                                onClick={() => props.onForward(fastCount)}>
                                            <CyclerButtonForwardFastSvg/>
                                        </Button>
                                        <Button className="cycler-button"
                                                disabled={props.working || !props.ready}
                                                style={{ width: '24px', height: '22px' }}
                                                onClick={props.onStop}>
                                            <CycleElementsPlaySvg/>
                                        </Button>
                                    </>
                                }
                                &nbsp;
                                {
                                    props.enabled &&
                                    <LabeledToggle
                                        label={IModelApp.i18n.translate("LabelingApp:forceShowAll")}
                                        isOn={props.forceShowAll}
                                        onChange={props.onForceShowAllChanged}
                                    />
                                }
                            </div>
                        </td>
                        {/*{*/}
                        {/*    !props.isPoppedOut &&*/}
                        {/*    <td className="mltc-popout-button-td">*/}
                        {/*        <div>*/}
                        {/*            <Button*/}
                        {/*                className="sstc-window-new-button"*/}
                        {/*                buttonType={ButtonType.Hollow}*/}
                        {/*                onClick={_onPopoutButtonClick}*/}
                        {/*            >*/}
                        {/*                <Icon iconSpec="icon-window-new"/>*/}
                        {/*            </Button>*/}
                        {/*            {*/}
                        {/*                readyForPopout &&*/}
                        {/*                <MLStateTablePopout*/}
                        {/*                    title={"ML Labeler"}*/}
                        {/*                    closingPopout={_onPopoutWindowClosing}/>*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*    </td>*/}
                        {/*}*/}
                    </tr>
                    </tbody>
                </table>
                <hr/>
            </div>
        </>
    );
};