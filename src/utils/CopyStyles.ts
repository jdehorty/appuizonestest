/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

/**
 * Copies the source CSS into the destination
 * @param targetDoc - target document
 * @param sourceDoc - source document
 * @protected
 */
export function copyStyles(targetDoc: Document, sourceDoc: Document = document) {
    const stylesheets = Array.from(sourceDoc.styleSheets);
    stylesheets.forEach(stylesheet => {
        const css = stylesheet as CSSStyleSheet;
        if (stylesheet.href) {
            const newStyleElement = sourceDoc.createElement('link');
            newStyleElement.rel = 'stylesheet';
            newStyleElement.href = stylesheet.href;
            targetDoc.head.appendChild(newStyleElement);
        } else if (css && css.cssRules && css.cssRules.length > 0) {
            const newStyleElement = sourceDoc.createElement('style');
            Array.from(css.cssRules).forEach(rule => {
                newStyleElement.appendChild(sourceDoc.createTextNode(rule.cssText));
            });
            targetDoc.head.appendChild(newStyleElement);
        }
    });
}

export function greeting() {
    return "hello world"
}