/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { Config } from "@bentley/bentleyjs-core";

/**
 * Setup configuration for the application
 */
export function SetupConfigEnv(regionCode: number = 103) {
    Config.App.merge({
        imjs_buddi_resolve_url_using_region: regionCode,
        oidc_client_id: 'design-insights-webapp',             // TODO: make this configurable
        oidc_authority: 'https://qa-imsoidc.bentley.com'      // TODO: make this configurable
    });
}