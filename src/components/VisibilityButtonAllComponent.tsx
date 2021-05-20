/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import "../styles/styles.scss"


/** GroupVisiblityButton properties */
export interface VisibilityButtonAllProps {
    /** Label for flyover (not translated internally) */
    label?: string;
    /** Set if transparency is available */
    transparencyAvailable: boolean;
    /** Are all items visible? */
    allVisible: boolean;
    /** Are all items hidden? */
    allHidden: boolean;
    /** Are all items transparent? */
    allTransparent: boolean;
    /** Are all items opaque? */
    allOpaque: boolean;

    /** Click handler */
    onClick?(newVisible: boolean, newTransparent: boolean): void;
}

/** Button that shows/changes the visibility status of a group of items (that may have different statuses) */
const VisibilityButtonAllComponent = (props: VisibilityButtonAllProps) => {
    let newVisible: boolean;
    let newTransparent: boolean;
    let actionI18nKey: string;
    let buttonClassName: string;

    let visibilityOn = ["m8 3c-3.4 0-6.5 1.9-8 5 2.2 4.4 7.5 6.3 11.9 4.1 1.8-.9 3.2-2.3 4.1-4.1-1.5-3.1-4.6-5-8-5m3.9 2.6c1 .6 1.8 1.4 2.4 2.4-.6.9-1.4 1.7-2.3 2.3-1.1.8-2.5 1.2-3.9 1.2-1.4 0-2.8-.4-3.9-1.2-1-.6-1.9-1.3-2.5-2.3.6-1 1.4-1.8 2.4-2.4.1 0 .1-.1.2-.1-.2.4-.3.9-.3 1.4 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.5-.1-.9-.1-1.3m-3.9.8c0 .8-.7 1.5-1.5 1.5-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5.8 0 1.5.6 1.5 1.5"];
    let visibilityTransparent = ["m8 0a1 1 0 0 0 -1 1v2.07135a8.91636 8.91636 0 0 0 -7 4.92865 8.91636 8.91636 0 0 0 7 4.92865v2.07135a1 1 0 0 0 2 0v-14a1 1 0 0 0 -1-1zm-1.5 4.9a1.55442 1.55442 0 0 1 .5.087v2.81451a1.40746 1.40746 0 0 1 -.5.09849 1.538 1.538 0 0 1 -1.5-1.5 1.53794 1.53794 0 0 1 1.5-1.5zm-2.3 5.4a6.9728 6.9728 0 0 1 -2.5-2.3 6.89435 6.89435 0 0 1 2.4-2.4c.1 0 .1-.1.2-.1a3.194 3.194 0 0 0 -.3 1.4 4.0047 4.0047 0 0 0 3 3.857v.65289a6.375 6.375 0 0 1 -2.8-1.10989z"];
    let visibilityOff = ["m1.70671 12.879 11.17218-11.17219 1.4142 1.4142-11.17218 11.17218zm.99329-1.679 1.1-1.1a5.06309 5.06309 0 0 1 -2-2.1 7.48271 7.48271 0 0 1 6.2-3.5 4.86864 4.86864 0 0 1 1.2.1l1.3-1.3a10.0745 10.0745 0 0 0 -2.5-.3 8.84128 8.84128 0 0 0 -8 5 8.42453 8.42453 0 0 0 2.7 3.2zm10.7-6.4-1.1 1.1a7.08628 7.08628 0 0 1 2 2.1 7.50321 7.50321 0 0 1 -6.2 3.5 8.31666 8.31666 0 0 1 -1.3-.2l-1.3 1.3a8.909 8.909 0 0 0 6.4-.5 9.04344 9.04344 0 0 0 4.1-4.1 9.16786 9.16786 0 0 0 -2.6-3.2z"];

    let svgVisibilityPathsArray: Array<string>;

    buttonClassName = "sstc-visibility-button";

    if (props.allVisible && !props.allTransparent) {
        if (props.transparencyAvailable) {
            newVisible = true;
            newTransparent = true;
        } else {
            newVisible = false;
            newTransparent = false;
        }
        svgVisibilityPathsArray = visibilityOn;
        actionI18nKey = "LabelingApp:makeAllTransparent";
    } else if (props.allTransparent) {
        newVisible = false;
        newTransparent = false;
        svgVisibilityPathsArray = visibilityTransparent;
        buttonClassName = "sstc-visibility-button transparent";
        actionI18nKey = "LabelingApp:hideAll";
    } else if (props.allHidden) {
        newVisible = true;
        newTransparent = false;
        svgVisibilityPathsArray = visibilityOff;
        actionI18nKey = "LabelingApp:showAll"
    } else {
        newVisible = false;
        newTransparent = false;
        svgVisibilityPathsArray = visibilityTransparent;
        actionI18nKey = "LabelingApp:showAll";
    }

    let title = IModelApp.i18n.translate(actionI18nKey);
    return <>
        <Button
            title={title}
            buttonType={ButtonType.Hollow}
            className={buttonClassName}
            onClick={() => {
                if (props.onClick !== undefined) {
                    props.onClick(newVisible, newTransparent);
                }
            }}
        >
            {/*<Visibility All Icon*/}
            <SvgPath
                viewBoxWidth={16}
                viewBoxHeight={16}
                paths={svgVisibilityPathsArray}
            />
        </Button>
    </>
};

export default VisibilityButtonAllComponent;