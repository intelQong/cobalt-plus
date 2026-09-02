<script lang="ts">
    import { onMount } from "svelte";
    import { unlockWithPasskey, passkeyLocked } from "$lib/state/passkey";
    import IconLock from "@tabler/icons-svelte/IconLock.svelte";
    import IconFingerprint from "@tabler/icons-svelte/IconFingerprint.svelte";
    import IconKey from "@tabler/icons-svelte/IconKey.svelte";
    import IconAlertCircle from "@tabler/icons-svelte/IconAlertCircle.svelte";

    let authenticating = false;
    let errorMessage = "";

    async function handleUnlock() {
        if (authenticating) return;
        authenticating = true;
        errorMessage = "";

        try {
            const success = await unlockWithPasskey();
            if (!success) {
                errorMessage = "Authentication cancelled or failed.";
            }
        } catch (err: any) {
            errorMessage = err.message || "Passkey verification failed. Please try again.";
        } finally {
            authenticating = false;
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleUnlock();
        }
    }

    onMount(() => {
        // Auto-prompt on mount for convenience
        const timer = setTimeout(() => {
            handleUnlock();
        }, 300);
        return () => clearTimeout(timer);
    });
</script>

<svelte:window on:keydown={handleKeyDown} />

<div class="lock-screen-overlay" role="dialog" aria-modal="true" aria-label="Passkey Access Lock">
    <div class="ambient-glow"></div>

    <div class="lock-card">
        <div class="icon-halo">
            <div class="icon-circle">
                {#if authenticating}
                    <IconFingerprint size={42} class="animate-pulse text-violet" />
                {:else}
                    <IconLock size={42} class="text-violet" />
                {/if}
            </div>
        </div>

        <h1 class="lock-title">Cobalt<span class="plus-glow">++</span> Access Control</h1>
        <p class="lock-subtitle">This personal instance is protected with WebAuthn Passkey verification.</p>

        {#if errorMessage}
            <div class="error-banner">
                <IconAlertCircle size={18} />
                <span>{errorMessage}</span>
            </div>
        {/if}

        <button
            type="button"
            class="unlock-button"
            on:click={handleUnlock}
            disabled={authenticating}
        >
            <IconKey size={20} />
            <span>{authenticating ? "Verifying Passkey..." : "Unlock with Passkey"}</span>
            <span class="shortcut-chip">↵</span>
        </button>

        <p class="lock-hint">Touch ID, Face ID, Windows Hello, or Security Key</p>
    </div>
</div>

<style>
    .lock-screen-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #08080c;
        padding: 1.5rem;
        overflow: hidden;
    }

    .ambient-glow {
        position: absolute;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.08) 45%, transparent 70%);
        filter: blur(80px);
        pointer-events: none;
    }

    .lock-card {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 440px;
        padding: 2.5rem 2rem;
        background: rgba(18, 18, 28, 0.85);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(139, 92, 246, 0.35);
        border-radius: 1.75rem;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8),
                    0 0 40px -10px rgba(139, 92, 246, 0.25);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .icon-halo {
        margin-bottom: 1.5rem;
        padding: 0.5rem;
        border-radius: 9999px;
        background: rgba(139, 92, 246, 0.1);
        border: 1px solid rgba(139, 92, 246, 0.25);
    }

    .icon-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 72px;
        height: 72px;
        border-radius: 9999px;
        background: rgba(26, 26, 40, 0.9);
        box-shadow: 0 0 25px rgba(139, 92, 246, 0.35);
    }

    :global(.text-violet) {
        color: #a78bfa;
    }

    :global(.animate-pulse) {
        animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.95); }
    }

    .lock-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #f8fafc;
        margin: 0 0 0.5rem 0;
        letter-spacing: -0.025em;
    }

    .plus-glow {
        color: #8b5cf6;
        text-shadow: 0 0 12px rgba(139, 92, 246, 0.7);
    }

    .lock-subtitle {
        font-size: 0.875rem;
        color: #94a3b8;
        line-height: 1.5;
        margin: 0 0 1.5rem 0;
    }

    .error-banner {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        margin-bottom: 1.25rem;
        background: rgba(239, 68, 68, 0.12);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 0.75rem;
        color: #fca5a5;
        font-size: 0.8125rem;
        text-align: left;
    }

    .unlock-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
        width: 100%;
        padding: 0.9rem 1.5rem;
        font-size: 0.9375rem;
        font-weight: 600;
        color: #ffffff;
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 8px 24px -4px rgba(139, 92, 246, 0.45);
    }

    .unlock-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px -4px rgba(139, 92, 246, 0.6);
        background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
    }

    .unlock-button:disabled {
        opacity: 0.7;
        cursor: wait;
    }

    .shortcut-chip {
        font-size: 0.6875rem;
        font-family: inherit;
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.375rem;
        padding: 0.125rem 0.375rem;
        margin-left: auto;
    }

    .lock-hint {
        font-size: 0.75rem;
        color: #64748b;
        margin: 1rem 0 0 0;
    }
</style>
