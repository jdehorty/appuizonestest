/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import React, {FC, useState} from 'react';
import {connect} from 'react-redux';
import {Button, Icon, LabeledToggle, SvgPath} from "@bentley/ui-core";
import {LabelTableComponentProps} from "./LabelTableAllComponent";
import {
    LabelTableDispatchFromProps,
    LabelTableStateFromProps,
    mapLabelTableDispatchToProps,
    mapLabelTableStateToProps
} from "./ConnectedLabelTableAllComponent";
import {RedoSvg} from "./RedoSvg";

const MINUTES = 1.0;

interface OwnProps extends LabelTableComponentProps {
    canUndo: boolean;
    canRedo: boolean;

    onSave(): void;

    onUndo(): void;

    onRedo(): void;
}

type Props = OwnProps & ReturnType<typeof mapLabelTableStateToProps>;

const LabelTableFooter: FC<Props> = (props) => {

    const [timerVar, setTimerVar] = useState<undefined | NodeJS.Timeout>(undefined);

    const autoSaveEnabled = timerVar !== undefined;


    const handleAutoSaveToggle = (enable: boolean) => {

        if (enable) {
            if (timerVar !== undefined) {
                clearInterval(timerVar);
            }
            setTimerVar(setInterval(props.onSave, 60000));

        } else {
            if (timerVar !== undefined) {
                clearInterval(timerVar);
            }
            setTimerVar(undefined);
        }
    }

    let btnStyle = {
        width: '24px',
        height: '22px',
    };

    return (
        <>
            {props.ready &&
            <div className="sstc-action-container">
                <Button className="sstc-control-button"
                        onClick={props.onSave}
                        disabled={!props.isDirty}>
                    <Icon iconSpec="icon-save"/>
                </Button> &nbsp;

                <div className="sstc-action-container-expand">
                    <LabeledToggle
                        label={`Auto Save (${MINUTES} min.)`}
                        isOn={autoSaveEnabled}
                        onChange={handleAutoSaveToggle}
                    />
                </div>

                <Button className="sstc-control-button"
                        onClick={props.onUndo}
                        disabled={!props.canUndo}
                        style={btnStyle}
                >
                    {/*<Icon iconSpec="icon-undo"/>*/}
                    <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                        "m16 14c0-5.2-4.2-9.3-9-9.4v-2.6l-7 5.3 7 5.3v-2.6c4.3 0 6.7 1.8 9 4"
                    ]}/>
                </Button> &nbsp;

                <Button className="sstc-control-button"
                        onClick={props.onRedo}
                        disabled={!props.canRedo}
                        style={btnStyle}
                >
                    {/*<Icon iconSpec="icon-redo"/>*/}
                    <RedoSvg/>
                </Button> &nbsp;
            </div>
            }
        </>
    );
};

export default connect<LabelTableStateFromProps, LabelTableDispatchFromProps>(mapLabelTableStateToProps, mapLabelTableDispatchToProps)(LabelTableFooter);
