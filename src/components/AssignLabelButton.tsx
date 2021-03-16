import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import '../styles/LabelingWorkflowStyles.scss';

export interface AssignLabelButtonProps<ItemT> {
    label?: string;
    name: ItemT;

    onClick?(name: ItemT): void;
}

export class AssignLabelButton<ItemT> extends React.PureComponent<AssignLabelButtonProps<ItemT>> {

    public render() {

        let btnStyle = {
            width: '24px',
            height: '22px',
            marginTop: '0'
        }
        let title = IModelApp.i18n.translate("LabelingApp:assignLabel");
        title += ": ";
        title += (this.props.label ? this.props.label : "");
        return <>
            <Button
                title={title}
                className="sstc-select-button"
                style={btnStyle}
                onClick={() => {
                    if (this.props.onClick !== undefined) {
                        this.props.onClick(this.props.name);
                    }
                }}
            >
                {/*<Icon iconSpec="icon-tag-2" />*/}
                <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                    "M9,0,0,9l7,7,9-9V0Zm3.5,5A1.5,1.5,0,1,1,14,3.5,1.5,1.5,0,0,1,12.5,5Z"
                ]}/>
            </Button>
        </>
    }
}
