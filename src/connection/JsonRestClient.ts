/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { AccessToken, IncludePrefix } from "@bentley/itwin-client";
import fetch, { Response } from "node-fetch";


interface UnknownObject {
    [key: string]: unknown;
}

function isObject(v: unknown): v is UnknownObject {
    return typeof v === "object" && v !== null;
}

/**
 * JSON REST Client to handle post/get requests to the ML API
 */
export class JsonRestClient {
    constructor(private _baseUrl: string, private _token: AccessToken) { }

    private static async handleResponse(response: Response): Promise<UnknownObject> {
        if (!response.ok) {
            throw new Error(`HTTP${response.status}: ${response.statusText}.  Response body is: ${(await response.text()).trim()}`);
        }
        const jsonResponse = await response.json();

        if (!isObject(jsonResponse))
            throw new Error(`Unknown response: "${JSON.stringify(response)}"`);

        return jsonResponse;
    }

    public async post(url: string, body: unknown): Promise<UnknownObject> {
        return JsonRestClient.handleResponse(await fetch(new URL(url, this._baseUrl), {
            body: JSON.stringify(body),
            headers: {
                "Accept": "application/json",
                "Authorization": this._token.toTokenString(IncludePrefix.Yes),
                "Content-Type": "application/json",
            },
            method: "POST",
        }));
    }

    public async get(url: string): Promise<UnknownObject> {
        return JsonRestClient.handleResponse(await fetch(new URL(url, this._baseUrl), {
            headers: {
                Accept: "application/json",
                Authorization: this._token.toTokenString(IncludePrefix.Yes),
            },
        }));
    }
}