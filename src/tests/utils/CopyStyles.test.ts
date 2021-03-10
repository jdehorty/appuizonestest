// import {generateText} from "../../utils/CopyStyles";
import { copyStyles } from "../../utils/CopyStyles";
import { JSDOM } from "jsdom";
import { valueEquals } from "./valueEquals";

describe("Copy Files Function", () => {
    /* test("Should match text", () => {
        // Step 1. Set up inputs for functionality being tested.
            // in this case we have no inputs.

        // Step 2. Created "canned" output variables (our expectations for the test).
        const expectedOutput = "hello Leela";

        // Step 3. Invoke target of test and capture "actual" output.
        let actual = generateText();

        expect(actual).toBe(expectedOutput);
    });*/


    test("Count of copied styles should match", () => {
        // Step 1. Set up inputs for functionality being tested.
        let sourceHtml = `<!DOCTYPE html>
        <html lang="en">  
            <head>
                <title>
                    iTwin Viewer React Sample
                </title>
                <style type="text/css">
                    p {color: #26b72b}
                </style>
                <style type="text/css">
                .sstc-isolate-button {
                    margin: 0 0 0 2px;
                    padding: 2px 4px;
                    fill: transparent;
                    border: 0 none;
                    font-size: 1.4em; }
                </style>
            </head>
            <body>
                <p>
                    This text will be green. Inline styles take precedence over CSS included externally.
                </p>
            </body>
        </html>`
    let targetHtml = `<!DOCTYPE html> 
        <html lang="en">  
            <head>
                <title>
                    iTwin Viewer React Sample
                </title>  
            </head>
            <body>
                <p>This text will be green. Inline styles take precedence over CSS included externally.</p>  
            </body>
        </html>`
   
        const sourceDom = new JSDOM(sourceHtml);
        const targetDom = new JSDOM(targetHtml);

        copyStyles(targetDom.window.document, sourceDom.window.document);

        // compare # of stylesheets
        const srcLength = sourceDom.window.document.styleSheets.length;
        const targetLength = targetDom.window.document.styleSheets.length;
        expect(srcLength).toBe(targetLength);

        // Now that we know we have the same number of stylesheets, check to 
        // see if each stylesheet (src and target) have the same count of styles.
        for (let sheetIndex=0; sheetIndex < srcLength; sheetIndex++) {
            const sourceSheet = sourceDom.window.document.styleSheets[sheetIndex];
            const targetSheet = targetDom.window.document.styleSheets[sheetIndex];
            for (let ruleIndex=0; ruleIndex < sourceSheet.cssRules.length; ruleIndex++) {
                let srcRule = sourceSheet.cssRules[ruleIndex];
                let targetRule = targetSheet.cssRules[ruleIndex];
                expect(srcRule.cssText).toBe(targetRule.cssText);
            }
        } 
       

        // Now check to see if src style color matches target style color.
        // <Add code here>


        
       
        
    });
});