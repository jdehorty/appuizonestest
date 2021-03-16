import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {LabelerState} from "../store/LabelerState";
import {ConnectedMLTableComponent} from "./ConnectedMLTable";
import {copyStyles} from "../utils/CopyStyles";
import {ConnectedCycleElementComponentPopout} from "./ConnectedCycleElements";

type Props = {
    title: string;                          // The title of the popout window
    closingPopout: () => void;              // Callback to notify parent that we are closing the popout
}

const MLStateTablePopout: React.FC<Props> = (props: Props) => {

    const [containerElement, setContainerElement] = useState<HTMLElement | null>(null); // root element

    // When we create this component, open a new window
    useEffect(() => {
        const popout = window.open('', '', 'width=520, height=720');

        let containerElement = null;
        if (popout) {
            containerElement = popout.document.createElement('div');
            popout.document.body.appendChild(containerElement);

            // Copy the app's styles into the new window
            copyStyles(popout.document, document);

            popout.document.title = props.title;

            popout.addEventListener('beforeunload', () => {
                // Notify our parent component that we are closing.
                props.closingPopout();
            });
        }

        setContainerElement(containerElement);

        // componentWillUnmount equivalent
        return () => {
            console.log("we reached unmount of MLStateTablePopout");
            if (popout) {
                popout.close();
            }
        }
    }, []);

    if (!containerElement) {
        return null;
    }

    let wrappedWidget = <>
        <Provider store={LabelerState.store}>
            <ConnectedCycleElementComponentPopout/>
            <ConnectedMLTableComponent/>
        </Provider>
    </>


    // Render this component's children into the root element of the popout window
    return ReactDOM.createPortal(wrappedWidget, containerElement);
}

export default MLStateTablePopout;
