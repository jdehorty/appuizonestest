import React, {FC} from 'react';
import {Button, ButtonType, SvgPath} from "@bentley/ui-core";
import {Presentation} from "@bentley/presentation-frontend";
import {IModelConnection} from "@bentley/imodeljs-frontend";
import {UiFramework} from "@bentley/ui-framework";

interface Props {
    onClick?(itemId?: string): void;
}

export const SelectionClearButtonComponent: FC<Props> = (props) => {

    const imodelConnection: IModelConnection | undefined = UiFramework.getIModelConnection();

    return <>
        <Button
            title={"LabelingApp:clearSelection"}
            className={"sstc-select-button"}
            buttonType={ButtonType.Blue}
            onClick={() => {
                Presentation.selection.clearSelection("", imodelConnection!);
            }}
        >
            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                "M2,5H1V7H2ZM2,8H1v2H2ZM9,2H7V3H9ZM6,2H4V3H6ZM2,3H3V2H1V4H2Zm12,7h1V8H14Zm0,2H13v1h2V11H14Zm0-5h1V5H14ZM7,13H9V12H7Zm3,0h2V12H10Zm-6.84551.75L14.25,2.65449,12.84551,1.25,1.75,12.34551Z"
            ]}/>
        </Button>
    </>;
};

export default SelectionClearButtonComponent;
