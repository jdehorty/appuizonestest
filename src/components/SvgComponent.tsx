/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import * as React from "react";
import {FC} from "react";

export interface SvgProps {
    width: string;
    height: string;
    viewBox: string;
    path: string;
}

/**
 * Functional component that renders an icon from an SVG path.
 * @param props.width percentage as string (e.g. "100%")
 * @param props.height percentage as string (e.g. "100%")
 * @param props.viewBox dimensions as string (e.g. "0 0 16 16")
 * @param props.path SVG path as string (e.g. "M9,0,0,9l7,7,9-9V0Zm3.5")
 */
export const Svg: FC<SvgProps> = (props) => {
    return <svg
        width={props.width}
        height={props.height}
        viewBox={props.viewBox}
    >
        <g>
            <path
                d={props.path}
            />
        </g>
    </svg>
};

