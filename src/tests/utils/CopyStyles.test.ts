// import {generateText} from "../../utils/CopyStyles";
import { copyStyles } from "../../utils/CopyStyles";
import { JSDOM } from "jsdom";

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
        let srcHtml = "<!DOCTYPE html>" +
        "<html lang=\"en\">" +
        "  <head>" +
        "    <title>iTwin Viewer React Sample</title>" +
        "	<style type=\"text/css\">" +
        "	p {" +
        "	color: #26b72b;" +
        "	}" +
        "	</style>" +
        "  </head>" +
        "  <body>" +
        "   <p>This text will be green. Inline styles take precedence + over CSS included externally.</p>" +
        "  </body>" +
        "</html>";

        let targetHtml = "<!DOCTYPE html>" +
        "<html lang=\"en\">" +
        "  <head>" +
        "    <title>iTwin Viewer React Sample</title>" +
        "  </head>" +
        "  <body>" +
        "   <p>This text will be green. Inline styles take precedence + over CSS included externally.</p>" +
        "  </body>" +
        "</html>";
   
        const sourceDom = new JSDOM(srcHtml);
        const targetDom = new JSDOM(targetHtml);

        copyStyles(targetDom.window.document, sourceDom.window.document);

        const srcLength = sourceDom.window.document.styleSheets.length;
        const targetLength = targetDom.window.document.styleSheets.length;

        // Now that we know we have the same number of stylesheets, check to 
        // see if each stylesheet (src and target) have the same count of styles.
        // <Add code here>

        // Now check to see if src style color matches target style color.
        // <Add code here>


        
       
        expect(srcLength).toBe(targetLength);
    });
});