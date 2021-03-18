import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import "../styles/LabelingWorkflowStyles.scss";

export interface AssignLabelButtonProps {
    label?: string;
    name: string;

    onClick?(name: string): void;
}

export const AssignLabelButton = (props: AssignLabelButtonProps) => {
    let btnStyle = {
        width: '24px',
        height: '22px',
        marginTop: '0'
    }
    let title = IModelApp.i18n.translate("LabelingApp:assignLabel");
    title += ": ";
    title += (props.label ? props.label : "");
    return <>
        <Button
            title={title}
            className="sstc-select-button"
            style={btnStyle}
            onClick={() => {
                if (props.onClick !== undefined) {
                    props.onClick(props.name);
                }
            }}
        >
            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                "M9,0,0,9l7,7,9-9V0Zm3.5,5A1.5,1.5,0,1,1,14,3.5,1.5,1.5,0,0,1,12.5,5Z"
            ]}/>
        </Button>
    </>
};