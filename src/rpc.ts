/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import {
    BentleyCloudRpcManager,
    BentleyCloudRpcParams, IModelReadRpcInterface, IModelTileRpcInterface,
    RpcConfiguration,
    RpcInterfaceDefinition, SnapshotIModelRpcInterface
} from "@bentley/imodeljs-common";
import {PresentationRpcInterface} from "@bentley/presentation-common";

/**
 * Returns a list of RPCs supported by this application
 */
function getSupportedRpcs(): RpcInterfaceDefinition[] {
    return [
        IModelReadRpcInterface,
        IModelTileRpcInterface,
        PresentationRpcInterface,
        SnapshotIModelRpcInterface,
    ];
}

/**
* Initializes RPC communication based on the platform
*/
export default function InitRpc(rpcParams?: BentleyCloudRpcParams): RpcConfiguration {
    let config: RpcConfiguration;
    const rpcInterfaces = getSupportedRpcs();
    if (!rpcParams)
        rpcParams = { info: { title: "imodeljs-labeling-tool", version: "v1.0" } };
    config = BentleyCloudRpcManager.initializeClient(rpcParams, rpcInterfaces);
    console.log("RPC initialized.")
    return config;
}

