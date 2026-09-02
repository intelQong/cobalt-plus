import { browser } from "$app/environment";
import { writable } from "svelte/store";

export interface CloudflareAccessIdentity {
    authenticated: boolean;
    email?: string;
    identityProvider?: string;
}

export const cloudflareAccessUser = writable<CloudflareAccessIdentity>({
    authenticated: false
});

/**
 * Checks for Cloudflare Access authentication context.
 * In a Cloudflare Pages environment protected by Zero Trust,
 * Cloudflare injects the CF_Authorization cookie and /cdn-cgi/access/get-identity endpoint.
 */
export async function checkCloudflareAccess(): Promise<CloudflareAccessIdentity> {
    if (!browser) return { authenticated: false };

    try {
        const res = await fetch("/cdn-cgi/access/get-identity", {
            headers: {
                "Accept": "application/json"
            }
        });

        if (res.ok) {
            const data = await res.json();
            const identity: CloudflareAccessIdentity = {
                authenticated: true,
                email: data.email || data.user_email || "Authenticated User",
                identityProvider: data.idp?.type || "Cloudflare Access"
            };
            cloudflareAccessUser.set(identity);
            return identity;
        }
    } catch {
        // Not running behind Cloudflare Access or local dev
    }

    const unauth: CloudflareAccessIdentity = { authenticated: false };
    cloudflareAccessUser.set(unauth);
    return unauth;
}
