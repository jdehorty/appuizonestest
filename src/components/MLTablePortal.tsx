import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import {LabelerState} from "../store/LabelerState";
import {ConnectedMLTableComponent} from "./ConnectedMLTable";

interface Props {
    title: string;                          // The title of the popout window
    closeWindow: () => void;                // Callback to close the popout
}

interface State {
    externalWindow: Window | null;          // The popout window
    containerElement: HTMLElement | null;   // The root element of the popout window
}

export default class MLTablePortal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            externalWindow: null,
            containerElement: null
        };
    }

    // When we create this component, open a new window
    public componentDidMount() {
        const features = 'width=800, height=500, left=300, top=200';
        const externalWindow = window.open('', '', features);

        let containerElement = null;
        if (externalWindow) {
            containerElement = externalWindow.document.createElement('div');
            externalWindow.document.body.appendChild(containerElement);

            // Copy the app's styles into the new window
            MLTablePortal.copyStyles(externalWindow.document, document);

            externalWindow.document.title = this.props.title;

            // Make sure the window closes when the component unloads
            externalWindow.addEventListener('beforeunload', () => {
                this.props.closeWindow();
            });
        }

        this.setState({
            externalWindow: externalWindow,
            containerElement: containerElement
        });
    }

    /**
     * Copies the source CSS into the destination
     * @param targetDoc - target document
     * @param srcDoc - source document
     * @protected
     */
    public static copyStyles(targetDoc: Document, srcDoc: Document = document) {
        const stylesheets = Array.from(srcDoc.styleSheets);
        stylesheets.forEach(stylesheet => {
            const css = stylesheet as CSSStyleSheet;
            if (stylesheet.href) {
                const newStyleElement = srcDoc.createElement('link');
                newStyleElement.rel = 'stylesheet';
                newStyleElement.href = stylesheet.href;
                targetDoc.head.appendChild(newStyleElement);
            } else if (css && css.cssRules && css.cssRules.length > 0) {
                const newStyleElement = srcDoc.createElement('style');
                Array.from(css.cssRules).forEach(rule => {
                    if (rule.cssText.includes("icon")) {
                        console.log('\x1b[36m%s\x1b[0m', rule.cssText) // cyan logging
                        console.log('\x1b[33m%s\x1b[0m', JSON.stringify(rule)) // yellow logging
                    }
                    newStyleElement.appendChild(srcDoc.createTextNode(rule.cssText));
                });
                targetDoc.head.appendChild(newStyleElement);
            }
        });
    }

    public static generateText() {
        return "hello Leela"
    }

// Make sure the window closes when the component unmounts
    public componentWillUnmount() {
        if (this.state.externalWindow) {
            this.state.externalWindow.close();
        }
    }

    public render() {
        if (!this.state.containerElement) {
            return null;
        }

        let wrappedWidget =
            <div>
                <Provider store={LabelerState.store}>
                    <ConnectedMLTableComponent/>
                </Provider>
            </div>;

        // Render this component's children into the root element of the popout window
        return ReactDOM.createPortal(wrappedWidget, this.state.containerElement);
    }
}