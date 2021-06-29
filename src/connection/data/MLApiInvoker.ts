export interface IMLApiInvoker {

}

/**
 * Used to provide a layer of abstraction to the ML Service API. This makes it easy to create a mock ML API Invoker
 * that we can use in testing via dependency injection.
 */
export class MLAPIInvoker implements IMLApiInvoker {
    constructor() {

    }

    // TODO: Implement ML API Calls needed by ML Labeling core package
}