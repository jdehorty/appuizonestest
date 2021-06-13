/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import React, {FC} from 'react';
import {Button, ButtonType} from "@bentley/ui-core";
import {Presentation} from "@bentley/presentation-frontend";
import {IModelApp, IModelConnection} from "@bentley/imodeljs-frontend";
import {UiFramework} from "@bentley/ui-framework";
import {SelectionClearButtonSvg} from "./SelectionClearButtonSvg";

interface Props {
    label?: string;
    hilite?: boolean;
    onClick?(itemId?: string): void;
    clearSelectionAction(): void;
}

export const SelectionClearButtonComponent: FC<Props> = (props) => {
    const imodelConnection: IModelConnection | undefined = UiFramework.getIModelConnection();
    let title = IModelApp.i18n.translate("LabelingApp:clearSelection");
    let className = "sstc-select-button";

    return <>
        <Button
            title={title}
            className={className}
            buttonType={ButtonType.Hollow}
            onClick={() => {
                Presentation.selection.clearSelection("", imodelConnection!);
                props.clearSelectionAction();
            }}
        >
            <SelectionClearButtonSvg/>
        </Button>
    </>;
};

export default SelectionClearButtonComponent;