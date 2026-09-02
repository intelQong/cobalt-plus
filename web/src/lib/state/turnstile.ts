import settings from "$lib/state/settings";
import cachedInfo from "$lib/state/server-info";
import { derived, writable } from "svelte/store";

export const turnstileSolved = writable(false);
export const turnstileCreated = writable(false);

export const turnstileEnabled = derived(
    [settings, cachedInfo],
    ([$settings, $cachedInfo]) => {
        const hasSitekey = !!$cachedInfo?.info?.cobalt?.turnstileSitekey;
        if (!hasSitekey) return false;

        if (
            $settings.processing.enableCustomApiKey &&
            $settings.processing.customApiKey.length > 0
        ) {
            return false;
        }

        // On non-official domains (e.g. self-hosted on pages.dev, custom domain, localhost),
        // the official api.cobalt.tools sitekey cannot be solved due to Cloudflare domain restrictions.
        // Only require turnstile if on the domain that matches the API origin or if explicitly configured.
        if (typeof window !== "undefined") {
            const currentHost = window.location.hostname;
            const isOfficial = currentHost === "cobalt.tools" || currentHost.endsWith(".cobalt.tools");
            const apiOrigin = $cachedInfo?.origin || "";
            const isMatchingOrigin = apiOrigin.includes(currentHost);

            return isOfficial || isMatchingOrigin;
        }

        return false;
    }
);

