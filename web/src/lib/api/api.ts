import { get } from "svelte/store";

import settings from "$lib/state/settings";

import { getSession, resetSession } from "$lib/api/session";
import { currentApiURL, rotateToNextCommunityInstance } from "$lib/api/api-url";
import { turnstileEnabled, turnstileSolved } from "$lib/state/turnstile";
import cachedInfo from "$lib/state/server-info";
import { getServerInfo } from "$lib/api/server-info";

import type { Optional } from "$lib/types/generic";
import type { CobaltAPIResponse, CobaltErrorResponse, CobaltSaveRequestBody } from "$lib/types/api";

const waitForTurnstile = async () => {
    return await new Promise((resolve) => {
        const unsub = turnstileSolved.subscribe((solved) => {
            if (solved) {
                unsub();
                resolve(true);
            }
        });

        // wait for turnstile for at most 3 seconds
        setTimeout(() => {
            unsub();
            resolve(false);
        }, 3 * 1000);
    });
}

const getAuthorization = async () => {
    const processing = get(settings).processing;
    if (processing.enableCustomApiKey && processing.customApiKey.length > 0) {
        return `Api-Key ${processing.customApiKey}`;
    }

    if (!get(turnstileEnabled)) {
        return;
    }

    if (!get(turnstileSolved)) {
        try {
            await waitForTurnstile();
        } catch {
            // graceful fallback
        }
    }

    const session = await getSession();

    if (session) {
        if ("error" in session) {
            if (session.error.code !== "error.api.auth.not_configured") {
                return session;
            }
        } else {
            return `Bearer ${session.token}`;
        }
    }
}

const executeRequest = async (api: string, requestBody: CobaltSaveRequestBody, authorization?: string | CobaltErrorResponse): Promise<Optional<CobaltAPIResponse>> => {
    if (authorization && typeof authorization !== "string") {
        return authorization;
    }

    let extraHeaders: Record<string, string> = {};
    if (authorization && typeof authorization === "string") {
        extraHeaders["Authorization"] = authorization;
    }

    return await fetch(api, {
        method: "POST",
        redirect: "manual",
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify(requestBody),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...extraHeaders,
        },
    })
    .then(r => r.json())
    .catch((e) => {
        if (e?.message?.includes("timed out")) {
            return {
                status: "error",
                error: {
                    code: "error.api.timed_out"
                }
            } as CobaltErrorResponse;
        }
        return undefined;
    });
};

const request = async (requestBody: CobaltSaveRequestBody, attempt = 0): Promise<Optional<CobaltAPIResponse>> => {
    await getServerInfo();

    let api = currentApiURL();
    let authorization = await getAuthorization();

    let response = await executeRequest(api, requestBody, authorization);

    // If request failed with auth token missing/invalid or unreachable, and custom instance is NOT locked by user:
    const isAuthError = response?.status === 'error' && (
        response.error.code === 'error.api.auth.jwt.missing' ||
        response.error.code === 'error.api.auth.jwt.invalid' ||
        response.error.code === 'error.api.auth.turnstile.missing' ||
        response.error.code === 'error.api.timed_out' ||
        !response
    );

    const hasUserCustomInstance = get(settings).processing.enableCustomInstances && get(settings).processing.customInstanceURL.length > 0;

    if (isAuthError && !hasUserCustomInstance && attempt < 3) {
        console.warn(`Instance ${api} returned error, rotating to next community instance...`);
        rotateToNextCommunityInstance();
        resetSession();
        return request(requestBody, attempt + 1);
    }

    if (
        response?.status === 'error'
            && response?.error.code === 'error.api.auth.jwt.invalid'
            && attempt === 0
    ) {
        resetSession();
        return request(requestBody, attempt + 1);
    }

    return response;
}

const probeCobaltTunnel = async (url: string) => {
    const request = await fetch(`${url}&p=1`).catch(() => {});
    if (request?.status === 200) {
        return request?.status;
    }
    return 0;
}

export default {
    request,
    probeCobaltTunnel,
}
