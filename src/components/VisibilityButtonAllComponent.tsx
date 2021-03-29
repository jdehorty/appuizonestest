import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, ButtonType, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import "../styles/styles.css"

/** GroupVisiblityButton properties */
export interface VisibilityButtonProps {
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
const VisibilityButtonAllComponent = (props: VisibilityButtonProps) => {
    let newVisible: boolean;
    let newTransparent: boolean;
    let actionI18nKey: string;
    let buttonClassName: string;

    let visibilityOn = ["m8 3c-3.4 0-6.5 1.9-8 5 2.2 4.4 7.5 6.3 11.9 4.1 1.8-.9 3.2-2.3 4.1-4.1-1.5-3.1-4.6-5-8-5m3.9 2.6c1 .6 1.8 1.4 2.4 2.4-.6.9-1.4 1.7-2.3 2.3-1.1.8-2.5 1.2-3.9 1.2-1.4 0-2.8-.4-3.9-1.2-1-.6-1.9-1.3-2.5-2.3.6-1 1.4-1.8 2.4-2.4.1 0 .1-.1.2-.1-.2.4-.3.9-.3 1.4 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.5-.1-.9-.1-1.3m-3.9.8c0 .8-.7 1.5-1.5 1.5-.8 0-1.5-.7-1.5-1.5 0-.8.7-1.5 1.5-1.5.8 0 1.5.6 1.5 1.5"];
    let visibilityTransparent = ["m8 0a1 1 0 0 0 -1 1v2.07135a8.91636 8.91636 0 0 0 -7 4.92865 8.91636 8.91636 0 0 0 7 4.92865v2.07135a1 1 0 0 0 2 0v-14a1 1 0 0 0 -1-1zm-1.5 4.9a1.55442 1.55442 0 0 1 .5.087v2.81451a1.40746 1.40746 0 0 1 -.5.09849 1.538 1.538 0 0 1 -1.5-1.5 1.53794 1.53794 0 0 1 1.5-1.5zm-2.3 5.4a6.9728 6.9728 0 0 1 -2.5-2.3 6.89435 6.89435 0 0 1 2.4-2.4c.1 0 .1-.1.2-.1a3.194 3.194 0 0 0 -.3 1.4 4.0047 4.0047 0 0 0 3 3.857v.65289a6.375 6.375 0 0 1 -2.8-1.10989z"];
    let visibilityOff = ["M2,5H1V7H2ZM2,8H1v2H2ZM9,2H7V3H9ZM6,2H4V3H6ZM2,3H3V2H1V4H2Zm12,7h1V8H14Zm0,2H13v1h2V11H14Zm0-5h1V5H14ZM7,13H9V12H7Zm3,0h2V12H10Zm-6.84551.75L14.25,2.65449,12.84551,1.25,1.75,12.34551Z"];

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
    } else if (props.allVisible && props.allTransparent) {
        newVisible = false;
        newTransparent = false;
        svgVisibilityPathsArray = visibilityOn;
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
        svgVisibilityPathsArray = visibilityOff;
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