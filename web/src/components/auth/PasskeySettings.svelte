<script lang="ts">
    import { onMount } from "svelte";
    import {
        passkeySupported,
        passkeyEnabled,
        registerNewPasskey,
        lockApp,
        removePasskey,
        initPasskeyState
    } from "$lib/state/passkey";
    import {
        cloudflareAccessUser,
        checkCloudflareAccess
    } from "$lib/auth/cloudflare-access";
    import IconFingerprint from "@tabler/icons-svelte/IconFingerprint.svelte";
    import IconLock from "@tabler/icons-svelte/IconLock.svelte";
    import IconTrash from "@tabler/icons-svelte/IconTrash.svelte";
    import IconCheck from "@tabler/icons-svelte/IconCheck.svelte";
    import IconShieldCheck from "@tabler/icons-svelte/IconShieldCheck.svelte";
    import IconCloud from "@tabler/icons-svelte/IconCloud.svelte";
    import IconAlertTriangle from "@tabler/icons-svelte/IconAlertTriangle.svelte";

    let registering = false;
    let feedback = "";
    let isError = false;

    async function handleRegister() {
        if (registering) return;
        registering = true;
        feedback = "";
        isError = false;

        try {
            const success = await registerNewPasskey("Cobalt++ Owner");
            if (success) {
                feedback = "Passkey registered successfully! Access is now secured.";
                isError = false;
            }
        } catch (err: any) {
            feedback = err.message || "Passkey registration failed or cancelled.";
            isError = true;
        } finally {
            registering = false;
        }
    }

    function handleLock() {
        lockApp();
    }

    function handleRemove() {
        if (confirm("Are you sure you want to remove passkey protection from this instance?")) {
            removePasskey();
            feedback = "Passkey protection removed.";
            isError = false;
        }
    }

    onMount(() => {
        initPasskeyState();
        checkCloudflareAccess();
    });
</script>

<div class="passkey-container">
    <!-- Section 1: In-App WebAuthn Passkey -->
    <div class="auth-section">
        {#if !$passkeySupported}
            <div class="warning-box">
                <IconAlertTriangle size={20} />
                <span>WebAuthn Passkeys require a secure HTTPS domain.</span>
            </div>
        {:else}
            <div class="status-row">
                <div class="status-indicator" class:active={$passkeyEnabled}>
                    {#if $passkeyEnabled}
                        <IconCheck size={16} />
                    {:else}
                        <IconLock size={16} />
                    {/if}
                </div>
                <div class="status-text">
                    <div class="status-title">
                        {$passkeyEnabled ? "Biometric Passkey Enabled" : "Biometric Passkey Disabled"}
                    </div>
                    <div class="status-desc">
                        {$passkeyEnabled
                            ? "Only your authorized biometric key or hardware token can unlock this instance."
                            : "Enable Touch ID, Face ID, Windows Hello, or a security key to restrict browser access."}
                    </div>
                </div>
            </div>

            {#if feedback}
                <div class="feedback-box" class:error={isError}>
                    <span>{feedback}</span>
                </div>
            {/if}

            <div class="actions-row">
                {#if !$passkeyEnabled}
                    <button
                        type="button"
                        class="action-btn primary"
                        on:click={handleRegister}
                        disabled={registering}
                    >
                        <IconFingerprint size={18} />
                        <span>{registering ? "Registering..." : "Enable Biometric Passkey"}</span>
                    </button>
                {:else}
                    <button type="button" class="action-btn secondary" on:click={handleLock}>
                        <IconLock size={18} />
                        <span>Lock Now</span>
                    </button>
                    <button type="button" class="action-btn danger" on:click={handleRemove}>
                        <IconTrash size={18} />
                        <span>Remove Passkey</span>
                    </button>
                {/if}
            </div>
        {/if}
    </div>

    <!-- Section 2: Cloudflare Zero Trust (Access) Edge Status -->
    <div class="cf-access-section">
        <div class="cf-header">
            <IconCloud size={18} class="cf-icon" />
            <span class="cf-title">Cloudflare Zero Trust (Access) Edge Gateway</span>
        </div>

        {#if $cloudflareAccessUser.authenticated}
            <div class="cf-status-active">
                <IconShieldCheck size={16} class="cf-shield" />
                <span>Edge Authenticated as: <strong>{$cloudflareAccessUser.email}</strong></span>
            </div>
        {:else}
            <div class="cf-status-info">
                <span>Protect your Pages deployment at the DNS/CDN edge with Cloudflare Access (100% Free). Requires login before any assets load.</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .passkey-container {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.25rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 1.25rem;
    }

    .auth-section {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .warning-box {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: 0.75rem;
        color: #fcd34d;
        font-size: 0.875rem;
    }

    .status-row {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .status-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.06);
        color: #94a3b8;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .status-indicator.active {
        background: rgba(139, 92, 246, 0.15);
        color: #a78bfa;
        border-color: rgba(139, 92, 246, 0.4);
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.3);
    }

    .status-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #f8fafc;
    }

    .status-desc {
        font-size: 0.8125rem;
        color: #94a3b8;
        line-height: 1.4;
        margin-top: 0.125rem;
    }

    .feedback-box {
        padding: 0.625rem 0.875rem;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 0.5rem;
        color: #6ee7b7;
        font-size: 0.8125rem;
    }

    .feedback-box.error {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.25);
        color: #fca5a5;
    }

    .actions-row {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
    }

    .action-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1.125rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.75rem;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .action-btn.primary {
        background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 4px 14px rgba(139, 92, 246, 0.35);
    }

    .action-btn.primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
    }

    .action-btn.secondary {
        background: rgba(255, 255, 255, 0.06);
        color: #f1f5f9;
        border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .action-btn.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .action-btn.danger {
        background: rgba(239, 68, 68, 0.1);
        color: #fca5a5;
        border: 1px solid rgba(239, 68, 68, 0.25);
    }

    .action-btn.danger:hover {
        background: rgba(239, 68, 68, 0.18);
    }

    .action-btn:disabled {
        opacity: 0.6;
        cursor: wait;
    }

    .cf-access-section {
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .cf-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #cbd5e1;
        font-size: 0.875rem;
        font-weight: 600;
    }

    :global(.cf-icon) {
        color: #f59e0b;
    }

    :global(.cf-shield) {
        color: #10b981;
    }

    .cf-status-active {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid rgba(16, 185, 129, 0.25);
        border-radius: 0.5rem;
        color: #6ee7b7;
        font-size: 0.8125rem;
    }

    .cf-status-info {
        font-size: 0.78125rem;
        color: #94a3b8;
        line-height: 1.4;
    }
</style>
