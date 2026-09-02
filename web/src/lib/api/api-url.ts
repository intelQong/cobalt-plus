import env from "$lib/env";
import { get, writable } from "svelte/store";
import settings from "$lib/state/settings";

export const EMBEDDED_COMMUNITY_INSTANCES = [
    "https://cobalt-api.kwiatekm.pl",
    "https://api.streamrip.app",
    "https://cobalt.xy2401.top",
    "https://cobaltapi.hyonsu.com"
];

let activeFallbackIndex = 0;

export const currentActiveInstance = writable<string>(EMBEDDED_COMMUNITY_INSTANCES[0]);

export const rotateToNextCommunityInstance = (): string => {
    activeFallbackIndex = (activeFallbackIndex + 1) % EMBEDDED_COMMUNITY_INSTANCES.length;
    const next = EMBEDDED_COMMUNITY_INSTANCES[activeFallbackIndex];
    currentActiveInstance.set(next);
    return next;
};

export const currentApiURL = () => {
    const processingSettings = get(settings).processing;
    const customInstanceURL = processingSettings.customInstanceURL;

    if (processingSettings.enableCustomInstances && customInstanceURL.length > 0) {
        return new URL(customInstanceURL).origin;
    }

    if (env.DEFAULT_API && !env.DEFAULT_API.includes("api.cobalt.tools")) {
        return new URL(env.DEFAULT_API).origin;
    }

    return EMBEDDED_COMMUNITY_INSTANCES[activeFallbackIndex];
};
