import { writable } from "svelte/store";
import { browser } from "$app/environment";
import {
    isPasskeySupported,
    isPasskeyEnabled,
    isPasskeyUnlocked,
    registerPasskey,
    authenticateWithPasskey,
    lockPasskeySession,
    disablePasskey
} from "$lib/auth/passkey";

export const passkeySupported = writable<boolean>(false);
export const passkeyEnabled = writable<boolean>(false);
export const passkeyLocked = writable<boolean>(false);

export function initPasskeyState(): void {
    if (!browser) return;
    const supported = isPasskeySupported();
    const enabled = isPasskeyEnabled();
    const unlocked = isPasskeyUnlocked();

    passkeySupported.set(supported);
    passkeyEnabled.set(enabled);
    passkeyLocked.set(enabled && !unlocked);
}

export async function registerNewPasskey(name?: string): Promise<boolean> {
    const success = await registerPasskey(name);
    if (success) {
        passkeyEnabled.set(true);
        passkeyLocked.set(false);
    }
    return success;
}

export async function unlockWithPasskey(): Promise<boolean> {
    const success = await authenticateWithPasskey();
    if (success) {
        passkeyLocked.set(false);
    }
    return success;
}

export function lockApp(): void {
    lockPasskeySession();
    passkeyLocked.set(true);
}

export function removePasskey(): void {
    disablePasskey();
    passkeyEnabled.set(false);
    passkeyLocked.set(false);
}
