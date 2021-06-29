import { IMLApiInvoker } from "../../data/MLApiInvoker";

/**
 * A mock ML API Invoker that we can use in testing via dependency injection.
 */
export class MockMLApiInvoker implements IMLApiInvoker {

    constructor() {

    }

    // TODO: Implement mock versions of ML API Calls as we implement the real thing in the ML API Invoker class
    // TODO: https://jestjs.io/docs/mock-functions

    // Real TDD will mock BaseDataSet, DataSet, etc. in a nicely isolated, not-talking-to-the internet, way.
}