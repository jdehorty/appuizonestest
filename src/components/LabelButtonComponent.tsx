/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button} from "@bentley/ui-core";
import * as React from "react";
import {Svg} from "./SvgComponent";

export interface LabelButtonProps {
    label?: string;
    name: string;
    isPoked?: boolean;
    onClick?(name: string): void;
}

export const LabelButtonComponent = (props: LabelButtonProps) => {
    let title = IModelApp.i18n.translate("LabelingApp:assignLabel");
    title += ": ";
    title += (props.label ? props.label : "");
    let pokedClassName = props.isPoked ? 'sstc-label-button-poked' : 'sstc-label-button';

    return <>
            <Button
                title={title}
                className={pokedClassName}
                onClick={() => {
                    if (props.onClick !== undefined) {
                        props.onClick(props.name);
                    }
                }}
            >
                <Svg
                    width={"100%"}
                    height={"100%"}
                    viewBox={"0 0 16 16"}
                    path={"M9,0,0,9l7,7,9-9V0Zm3.5,5A1.5,1.5,0,1,1,14,3.5,1.5,1.5,0,0,1,12.5,5Z"}
                />
            </Button>
    </>
};