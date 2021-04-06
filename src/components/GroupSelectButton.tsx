import {IModelApp} from "@bentley/imodeljs-frontend";
import {Button, SvgPath} from "@bentley/ui-core";
import * as React from "react";
import '../styles/LabelingWorkflowStyles.scss';
import {FC} from "react";

/** SelectionButton properties */
type Props = {
    /** Label for flyover (not translated internally) */
    label?: string;
    /** Item reference */
    itemId?: string;
    /** Highlight */
    hilite?: boolean;
    /** Click handler */
    onClick?(itemId?: string | undefined): void;
}

/** Button to select an item */
export const GroupSelectButtonComponent: FC<Props> = (props) => {
    let title = IModelApp.i18n.translate("LabelerState:select");
    title += ": ";
    title += (props.label ? props.label : "");
    let className = "sstc-select-button";
    if (props.hilite !== undefined) {
        className += " " + (props.hilite ? "on" : "off");
    }
    return <>
        <Button
            title={title}
            className={className}
            style={{width: 24, height: 22}}
            onClick={() => {
                if (props.onClick !== undefined) {
                    props.onClick(props.itemId);
                }
            }}
        >
            <SvgPath viewBoxWidth={16} viewBoxHeight={16} paths={[
                "m2 8h-1v-2h1zm10-8h-2v1h2zm-10 3h-1v2h1zm12-1h1v-2h-2v1h1zm1 1h-1v2h1zm-1 5h1v-2h-1zm0 1v.569l1 1.1" +
                "3641v-1.70541zm-7 2h2v-1h-2zm-3-10h2v-1h-2zm3 0h2v-1h-2zm-5 8h-1v2h2v-1h-1zm2 2h2v-1h-2zm-3-9h1v-1" +
                "h1v-1h-2zm9.9932 11.994v-5.7862a.24652.24652 0 0 1 .0526-.1461.18355.18355 0 0 1 .2834-.0141l3.616" +
                "1 4.1093a.22878.22878 0 0 1 .0443.0764.23449.23449 0 0 1 -.1095.2898l-1.2639.5724.8275 2.2721a.2409" +
                "4.24094 0 0 1 -.1103.2919l-.7222.3376h-.0803a.18592.18592 0 0 1 -.1805-.1316l-.8275-2.2549-1.2639.5" +
                "723a.15291.15291 0 0 1 -.1805 0 .24636.24636 0 0 1 -.0853-.1889z"
            ]}/>
        </Button>
    </>
};

