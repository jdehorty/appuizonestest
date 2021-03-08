/**
 * Copies the source CSS into the destination
 * @param targetDoc - target document
 * @param srcDoc - source document
 * @protected
 */
export function copyStyles(targetDoc: Document, srcDoc: Document = document) {
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

export function greeting() {
    return "hello world"
}