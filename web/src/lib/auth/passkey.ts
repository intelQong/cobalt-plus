import { browser } from "$app/environment";

const STORAGE_KEY_ENABLED = "cobalt_passkey_enabled";
const STORAGE_KEY_CREDENTIAL = "cobalt_passkey_credential";
const SESSION_KEY_UNLOCKED = "cobalt_passkey_unlocked";

export function isPasskeySupported(): boolean {
    if (!browser) return false;
    return Boolean(
        typeof window !== "undefined" &&
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential === "function"
    );
}

export function isPasskeyEnabled(): boolean {
    if (!browser) return false;
    return localStorage.getItem(STORAGE_KEY_ENABLED) === "true";
}

export function isPasskeyUnlocked(): boolean {
    if (!browser) return true;
    if (!isPasskeyEnabled()) return true;
    return sessionStorage.getItem(SESSION_KEY_UNLOCKED) === "true";
}

function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

export async function registerPasskey(userName: string = "Cobalt++ Owner"): Promise<boolean> {
    if (!isPasskeySupported()) {
        throw new Error("WebAuthn / Passkeys are not supported in this browser.");
    }

    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
            name: "Cobalt++ Access Control",
            id: window.location.hostname
        },
        user: {
            id: userId,
            name: userName,
            displayName: userName
        },
        pubKeyCredParams: [
            { type: "public-key", alg: -7 },  // ES256
            { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
            userVerification: "preferred",
            residentKey: "preferred"
        },
        timeout: 60000,
        attestation: "none"
    };

    try {
        const credential = (await navigator.credentials.create({
            publicKey: publicKeyOptions
        })) as PublicKeyCredential;

        if (!credential) {
            return false;
        }

        const credData = {
            id: credential.id,
            rawId: bufferToBase64(credential.rawId),
            type: credential.type,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY_CREDENTIAL, JSON.stringify(credData));
        localStorage.setItem(STORAGE_KEY_ENABLED, "true");
        sessionStorage.setItem(SESSION_KEY_UNLOCKED, "true");
        return true;
    } catch (err: any) {
        console.error("Passkey registration failed:", err);
        throw err;
    }
}

export async function authenticateWithPasskey(): Promise<boolean> {
    if (!isPasskeySupported()) {
        throw new Error("WebAuthn / Passkeys are not supported in this browser.");
    }

    const credJson = localStorage.getItem(STORAGE_KEY_CREDENTIAL);
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const publicKeyOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: "preferred",
        rpId: window.location.hostname
    };

    if (credJson) {
        try {
            const credData = JSON.parse(credJson);
            if (credData.rawId) {
                publicKeyOptions.allowCredentials = [
                    {
                        id: base64ToBuffer(credData.rawId),
                        type: "public-key"
                    }
                ];
            }
        } catch {
            // allow fallback
        }
    }

    try {
        const assertion = await navigator.credentials.get({
            publicKey: publicKeyOptions
        });

        if (assertion) {
            sessionStorage.setItem(SESSION_KEY_UNLOCKED, "true");
            return true;
        }
        return false;
    } catch (err: any) {
        console.error("Passkey authentication failed:", err);
        throw err;
    }
}

export function lockPasskeySession(): void {
    if (browser) {
        sessionStorage.removeItem(SESSION_KEY_UNLOCKED);
    }
}

export function disablePasskey(): void {
    if (browser) {
        localStorage.removeItem(STORAGE_KEY_ENABLED);
        localStorage.removeItem(STORAGE_KEY_CREDENTIAL);
        sessionStorage.removeItem(SESSION_KEY_UNLOCKED);
    }
}
