import { IModelApp } from "@bentley/imodeljs-frontend";
import {Button, ButtonType, Icon, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import '../styles/LabelingWorkflowStyles.scss';

/** GroupVisiblityButton properties */
export interface AppearanceBatchToggleComponentProps {
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
export class AppearanceBatchToggleComponent extends React.PureComponent<AppearanceBatchToggleComponentProps> {
    public render() {
        let newVisible: boolean;
        let newTransparent: boolean;
        let labelToggleClass: string;
        let labelToggleIconSpec: string;
        if (this.props.allVisible && this.props.allOpaque) {
            labelToggleClass = "on";
            labelToggleIconSpec = "icon-visibility";
            if (this.props.transparencyAvailable) {
                newVisible = true;
                newTransparent = true;
            } else {
                newVisible = false;
                newTransparent = false;
            }
        } else if (this.props.allVisible && this.props.allTransparent) {
            labelToggleClass = "transparent";
            labelToggleIconSpec = "icon-isolate";
            newVisible = false;
            newTransparent = false;
        } else if (this.props.allHidden) {
            labelToggleClass = "off";
            labelToggleIconSpec = "icon-visibility-hide-2";
            newVisible = true;
            newTransparent = false;
        } else {
            labelToggleClass = "mixed";
            // labelToggleIconSpec = "icon-visibility-semi-transparent";
            labelToggleIconSpec = "icon-more";
            newVisible = false;
            newTransparent = false;
        }

        let btnStyle = {
            width: '24px',
            height: '22px',
        }

        let title = IModelApp.i18n.translate(newVisible ? "LabelerState.show" : "LabelerState.hide");
        title += ": ";
        title += (this.props.label ? this.props.label : "");
        return <>
            <Button
                title={title}
                buttonType={ButtonType.Blue}
                className={"sstc-visibility-button " + labelToggleClass}
                onClick={() => {
                        if (this.props.onClick !== undefined) {
                            this.props.onClick(newVisible, newTransparent);
                        }
                    }
                }
                style={btnStyle}
            >
                {/*<Icon iconSpec={labelToggleIconSpec} />*/}
                <SvgPath viewBoxWidth={16} viewBoxHeight={16}  paths={[
                    "m8 3c-3.4 0-6.5 1.9-8 5 2.2 4.4 7.5 6.3 11.9 4.1 1.8-.9 3.2-2.3 4.1-4.1-1.5-3.1-4.6-5-8-5m3.9 " +
                    "2.6c1 .6 1.8 1.4 2.4 2.4-.6.9-1.4 1.7-2.3 2.3-1.1.8-2.5 1.2-3.9 1.2-1.4 0-2.8-.4-3.9-1.2-1-.6-" +
                    "1.9-1.3-2.5-2.3.6-1 1.4-1.8 2.4-2.4.1 0 .1-.1.2-.1-.2.4-.3.9-.3 1.4 0 2.2 1.8 4 4 4s4-1.8"
                ]}/>
            </Button>
        </>
    }
}

// TODO: Make less tightly coupled to the UI