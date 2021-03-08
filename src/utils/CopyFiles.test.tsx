import {generateText} from "./CopyFiles";

describe("Copy Files Function", () => {
    test("Should match text", () => {
        // Step 1. Set up inputs for functionality being tested.
            // in this case we have no inputs.

        // Step 2. Created "canned" output variables (our expectations for the test).
        const expectedOutput = "hello Leela";

        // Step 3. Invoke target of test and capture "actual" output.
        let actual = generateText();

        expect(actual).toBe(expectedOutput);
    });
});