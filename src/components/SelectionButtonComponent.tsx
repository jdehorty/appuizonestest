/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType} from "@bentley/ui-core";
import * as React from "react";
import {FC} from "react";
import {SelectionButtonSvg} from "./SelectionButtonSvg";

/** SelectionButton properties */
interface SelectButtonProps {
    /** Label for flyover (not translated internally) */
    label?: string;
    /** Item reference */
    itemId?: string;
    /** Hilite */
    hilite?: boolean;
    /** Click handler */
    onClick?(itemId?: string): void;
}

/** Button to select an item */
export const SelectionButtonComponent: FC<SelectButtonProps> = (props) => {
    let title = IModelApp.i18n.translate("LabelingApp:select");
    title += ": ";
    title += (props.label ? props.label : "");
    let className = "sstc-select-button";
    if (props.hilite !== undefined) {
        className += props.hilite ? " on" : " off";
    }
    return <>
        <Button
            title={title}
            className={className}
            buttonType={ButtonType.Blue}
            onClick={() => {
                if (props.onClick !== undefined) {
                    props.onClick(props.itemId);
                }
            }}
        >
            <SelectionButtonSvg/>
        </Button>
    </>
};
