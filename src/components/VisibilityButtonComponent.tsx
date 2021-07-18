/*
 *  Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType, SvgPath} from "@bentley/ui-core";
import * as React from "react";

import "../styles/styles.scss"


/** TristateVisiblityButton properties */
interface VisibilityButtonProps {
    /** Label for flyover (not translated internally) */
    label?: string;
    /** Set if transparency is available */
    transparencyAvailable: boolean;
    /** Item reference */
    itemId?: string;
    /** Is this item visible? */
    visible: boolean;
    /** Is this item transparent? */
    transparent: boolean;

    /** Click handler */
    onClick?(newVisible: boolean, newTransparent: boolean, itemId?: string): void;
}

/** Button that shows/changes the visibility status of an item */
const VisibilityButtonComponent = (props: VisibilityButtonProps) => {
    let newVisible: boolean;
    let newTransparent: boolean;
    let actionI18nKey: string;
    let buttonClassName: string;
    let visibilityOn = ["m8 3c-3.4 0-6.5 1.9-8 5 2.2 4.4 7.5 6.3 11.9 4.1 1.8-.9 3.2-2.3 4.1-4.1-1.5-3.1-4.6-5-8-5m3.9 2.6c1 .6 1.8 1.4 2.4 2.4-.6.9-1.4 1.7-2.3 2.3-1.1.8-2.5 1.2-3.9 1.2-1.4 0-2.8-.4-3.9-1.2-1-.6-1.9-1.3-2.5-2.3.6-1 1.4-1.8 2.4-2.4.1 0 .1-.1.2-.1-.2.4-.3.9-.3 1.4 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.5-.1-.9-.1-1.3m-3.9.8c0 .8-.7 1.5-1.5 1.5-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5.8 0 1.5.6 1.5 1.5"];
    let visibilityOff = ["m1.70671 12.879 11.17218-11.17219 1.4142 1.4142-11.17218 11.17218zm.99329-1.679 1.1-1.1a5.06309 5.06309 0 0 1 -2-2.1 7.48271 7.48271 0 0 1 6.2-3.5 4.86864 4.86864 0 0 1 1.2.1l1.3-1.3a10.0745 10.0745 0 0 0 -2.5-.3 8.84128 8.84128 0 0 0 -8 5 8.42453 8.42453 0 0 0 2.7 3.2zm10.7-6.4-1.1 1.1a7.08628 7.08628 0 0 1 2 2.1 7.50321 7.50321 0 0 1 -6.2 3.5 8.31666 8.31666 0 0 1 -1.3-.2l-1.3 1.3a8.909 8.909 0 0 0 6.4-.5 9.04344 9.04344 0 0 0 4.1-4.1 9.16786 9.16786 0 0 0 -2.6-3.2z"];

    let svgVisibilityPathsArray: Array<string>;

    buttonClassName = "sstc-visibility-button";

    if (props.visible && !props.transparent) { // the class is fully visible, next on deck is make transparent
        // Current
        svgVisibilityPathsArray = visibilityOn;

        // Next
        if (props.transparencyAvailable) {
            newVisible = true;
            newTransparent = true;
            actionI18nKey = "LabelingApp:makeTransparent";
        } else {
            newVisible = false;
            newTransparent = false;
            actionI18nKey = "LabelingApp:hide";
        }
       
    } else if (props.visible && props.transparent) { // the class is transparent, next on deck is to hide
        // Current
        svgVisibilityPathsArray = visibilityOn;
        buttonClassName = "sstc-visibility-button transparent";
        // Next
        newVisible = false;
        newTransparent = false;
        actionI18nKey = "LabelingApp:hide";
    } else { // the class is hidden, next on deck is to show
        // Current
        svgVisibilityPathsArray = visibilityOff;
        // Next
        newVisible = true;
        newTransparent = false;
        actionI18nKey = "LabelingApp:show";
    }

    let title = IModelApp.i18n.translate(actionI18nKey);
    title += ": ";
    title += (props.label ? props.label : "");

    return <>
        <Button
            title={title}
            buttonType={ButtonType.Hollow}
            className={buttonClassName}
            onClick={() => {
                if (props.onClick !== undefined) {
                    props.onClick(newVisible, newTransparent, props.itemId);
                }
            }}
        >
            {/*<Visibility Icon*/}
            <SvgPath
                viewBoxWidth={16}
                viewBoxHeight={16}
                paths={svgVisibilityPathsArray}
            />
        </Button>
    </>
};

export default VisibilityButtonComponent;