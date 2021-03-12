import { IModelApp } from "@bentley/imodeljs-frontend";
import {Button, ButtonType, Icon, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import '../styles/LabelingWorkflowStyles.scss';

/** TristateVisiblityButton properties */
interface AppearanceToggleComponentProps<ItemT> {
    /** Label for flyover (not translated internally) */
    label?: string;
    /** Set if transparency is available */
    transparencyAvailable: boolean;
    /** Item reference */
    itemId?: ItemT;
    /** Is this item visible? */
    visible: boolean;
    /** Is this item transparent? */
    transparent: boolean;
    /** Click handler */
    onClick?(newVisible: boolean, newTransparent: boolean, itemId?: ItemT): void;
}

/** Button that shows/changes the visibility status of an item */
export class AppearanceToggleComponent<ItemT> extends React.PureComponent<AppearanceToggleComponentProps<ItemT>> {
    public render() {
        let newVisible: boolean;
        let newTransparent: boolean;
        let actionI18nKey: string;
        let buttonClassName: string;
        let iconSpec: string;
        if (this.props.visible && !this.props.transparent) {
            if (this.props.transparencyAvailable) {
                newVisible = true;
                newTransparent = true;
            } else {
                newVisible = false;
                newTransparent = false;
            }
            actionI18nKey = "LabelerState:makeTransparent";
            buttonClassName = "sstc-visibility-button on";
            iconSpec = "icon-visibility";
        } else if (this.props.visible && this.props.transparent) {
            newVisible = false;
            newTransparent = false;
            actionI18nKey = "LabelerState:hide";
            buttonClassName = "sstc-visibility-button transparent";
            iconSpec = "icon-isolate";
        } else {
            newVisible = true;
            newTransparent = false;
            actionI18nKey = "LabelerState:show";
            buttonClassName = "sstc-visibility-button off";
            iconSpec = "icon-visibility-hide-2";
        }

        let btnStyle = {
            width: '24px',
            height: '22px',
        }

        let title = IModelApp.i18n.translate(actionI18nKey);
        title += ": ";
        title += (this.props.label ? this.props.label : "");
        return <>
            <Button
                    title={title}
                    buttonType={ButtonType.Blue}
                    className={buttonClassName}
                    onClick={()=>{
                        if (this.props.onClick !== undefined) {
                            this.props.onClick(newVisible, newTransparent, this.props.itemId);
                        }
                    }}
                    style = {btnStyle}
                >
                    {/*<Icon iconSpec={iconSpec} />*/}
                    <SvgPath viewBoxWidth={16} viewBoxHeight={16}  paths={[
                         "m8 3c-3.4 0-6.5 1.9-8 5 2.2 4.4 7.5 6.3 11.9 4.1 1.8-.9 3.2-2.3 4.1-4.1-1.5-3.1-4.6-5-8-5m3.9 " +
                         "2.6c1 .6 1.8 1.4 2.4 2.4-.6.9-1.4 1.7-2.3 2.3-1.1.8-2.5 1.2-3.9 1.2-1.4 0-2.8-.4-3.9-1.2-1-.6-" +
                         "1.9-1.3-2.5-2.3.6-1 1.4-1.8 2.4-2.4.1 0 .1-.1.2-.1-.2.4-.3.9-.3 1.4 0 2.2 1.8 4 4 4s4-1.8" +
                         " 4-4c0-.5-.1-.9-.1-1.3m-3.9.8c0 .8-.7 1.5-1.5 1.5-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5.8 0 1.5.6 1.5 1.5"
                    ]}/>
            </Button>
        </>
    }
}
