import env from "$lib/env";
import { get } from "svelte/store";
import settings from "$lib/state/settings";

export const currentApiURL = () => {
    const processingSettings = get(settings).processing;
    const customInstanceURL = processingSettings.customInstanceURL;

    if (processingSettings.enableCustomInstances && customInstanceURL.length > 0) {
        try {
            return new URL(customInstanceURL).origin;
        } catch {
            return customInstanceURL;
        }
    }

    if (env.DEFAULT_API) {
        try {
            return new URL(env.DEFAULT_API).origin;
        } catch {
            return env.DEFAULT_API;
        }
    }

    return "https://api.cobalt.tools";
};
