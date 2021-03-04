import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import {LabelingApp} from "./LabelingApp";
import {ConnectedMLTableComponent} from "./ConnectedMLTable";
import {Provider} from "react-redux";
import './LabelingWorkflowStyles.scss';

// function copyStyles(sourceDoc: Document, targetDoc: Document) {
//     Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
//         if (styleSheet.cssRules) { // true for inline styles
//             const newStyleEl = sourceDoc.createElement('style');
//
//             Array.from(styleSheet.cssRules).forEach(cssRule => {
//                 newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
//             });
//
//             targetDoc.head.appendChild(newStyleEl);
//         } else if (styleSheet.href) { // true for stylesheets loaded from a URL
//             const newLinkEl = sourceDoc.createElement('link');
//
//             newLinkEl.rel = 'stylesheet';
//             newLinkEl.href = styleSheet.href;
//             targetDoc.head.appendChild(newLinkEl);
//         }
//     });
// }

const MLTablePortal: React.FC = () => {

    const [containerElement, setContainerElement] = useState(document.createElement('div'));
    const [linkElement, setLinkElement] = useState(document.createElement('link'));
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", "LabelingWorkflowStyles2.css");

    let externalWindow: any = null;

    const [copiedStylesOnce, setCopiedStylesOnce] = useState(false);

    // useEffect(
    //     () => {
    //         externalWindow = window.open(
    //             "",
    //             "",
    //             `width=600,height=400,left=200,top=200`
    //         );
    //
    //         externalWindow.document.body.appendChild(containerElement);
    //
    //         externalWindow.document.head.appendChild(linkElement);
    //
    //         externalWindow.addEventListener("beforeunload", () => {
    //             // props.closePopupWindowWithHooks();
    //         });
    //         console.log("Created Popup Window");
    //         return function cleanup() {
    //             console.log("Cleaned up Popup Window");
    //             externalWindow.close();
    //             externalWindow = null;
    //         };
    //     },
    //     // Only re-renders this component if the variable changes
    //     []
    // );

    // useEffect(() => {
    //     if (!copiedStylesOnce) {
    //         copyStyles(document, externalWindow.document);
    //         setCopiedStylesOnce(true);
    //     }
    // }, [])

    interface Props {
        title: string;                          // The title of the popout window
        closeWindow: () => void;                // Callback to close the popout
    }

    interface State {
        externalWindow: Window | null;          // The popout window
        containerElement: HTMLElement | null;   // The root element of the popout window
    }

    class MLTablePortal extends React.Component<Props, State> {
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
                const stylesheets = Array.from(document.styleSheets);
                stylesheets.forEach(stylesheet => {
                    const css = stylesheet as CSSStyleSheet;

                    if (stylesheet.href) {
                        const newStyleElement = document.createElement('link');
                        newStyleElement.rel = 'stylesheet';
                        newStyleElement.href = stylesheet.href;
                        externalWindow.document.head.appendChild(newStyleElement);
                    } else if (css && css.cssRules && css.cssRules.length > 0) {
                        const newStyleElement = document.createElement('style');
                        Array.from(css.cssRules).forEach(rule => {
                            newStyleElement.appendChild(document.createTextNode(rule.cssText));
                        });
                        externalWindow.document.head.appendChild(newStyleElement);
                    }
                });

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
                    <Provider store={LabelingApp.store}>
                        <ConnectedMLTableComponent />
                    </Provider>
                </div>;

            // Render this component's children into the root element of the popout window
            return ReactDOM.createPortal(wrappedWidget, this.state.containerElement);
        }
    }


    let wrappedWidget =
        <div>
            <Provider store={LabelingApp.store}>
                <ConnectedMLTableComponent />
            </Provider>
        </div>;


    return ReactDOM.createPortal(wrappedWidget, containerElement);
};

export default MLTablePortal;



