<script lang="ts">
    import settings from "$lib/state/settings";
    import { t } from "$lib/i18n/translations";

    import SettingsInput from "$components/settings/SettingsInput.svelte";
    import SettingsToggle from "$components/buttons/SettingsToggle.svelte";
    import SettingsCategory from "$components/settings/SettingsCategory.svelte";
    import IconServer from "@tabler/icons-svelte/IconServer.svelte";
    import IconExternalLink from "@tabler/icons-svelte/IconExternalLink.svelte";
</script>

<SettingsCategory
    sectionId="community"
    title={$t("settings.processing.community")}
>
    <div class="category-inside-group">
        <SettingsToggle
            settingContext="processing"
            settingId="enableCustomInstances"
            title={$t("settings.processing.enable_custom.title")}
        />
        {#if $settings.processing.enableCustomInstances}
            <SettingsInput
                settingContext="processing"
                settingId="customInstanceURL"
                placeholder="https://api.yourdomain.com"
                showInstanceWarning
                altText={$t("settings.processing.custom_instance.input.alt_text")}
            />
        {/if}
    </div>
    <div class="subtext">
        {$t("settings.processing.enable_custom.description")}
    </div>
</SettingsCategory>

<SettingsCategory
    sectionId="access-key"
    title={$t("settings.processing.access_key")}
>
    <div class="category-inside-group">
        <SettingsToggle
            settingContext="processing"
            settingId="enableCustomApiKey"
            title={$t("settings.processing.access_key.title")}
        />
        {#if $settings.processing.enableCustomApiKey}
            <SettingsInput
                settingContext="processing"
                settingId="customApiKey"
                placeholder="00000000-0000-0000-0000-000000000000"
                altText={$t("settings.processing.access_key.input.alt_text")}
                type="uuid"
                sensitive
            />
        {/if}
    </div>
    <div class="subtext">
        {$t("settings.processing.access_key.description")}
    </div>
</SettingsCategory>

<!-- Self-Hosting Free Backend Guide -->
<div class="hosting-guide-card">
    <div class="guide-header">
        <IconServer size={18} class="guide-icon" />
        <span class="guide-title">How to Run Your Own Free Private Backend</span>
    </div>
    <p class="guide-desc">
        To download without captcha or rate limits, deploy the backend code (<code class="guide-code">api/</code>) to any free cloud host (Render, Fly.io, Railway, or Docker):
    </p>
    <div class="guide-steps">
        <div class="guide-step">
            <span class="step-num">1</span>
            <span>Deploy the backend on <a href="https://render.com" target="_blank" rel="noopener noreferrer" class="guide-link">Render.com <IconExternalLink size={12} /></a> or <a href="https://fly.io" target="_blank" rel="noopener noreferrer" class="guide-link">Fly.io <IconExternalLink size={12} /></a> using Docker.</span>
        </div>
        <div class="guide-step">
            <span class="step-num">2</span>
            <span>Set environment variables: <code class="guide-code">API_AUTH_REQUIRED=false</code></span>
        </div>
        <div class="guide-step">
            <span class="step-num">3</span>
            <span>Enable <strong>"Use custom processing instance"</strong> above and paste your deployment URL.</span>
        </div>
    </div>
</div>

<style>
    .category-inside-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .subtext {
        margin-top: -3px;
    }

    .hosting-guide-card {
        margin-top: 1rem;
        padding: 1.25rem;
        background: rgba(139, 92, 246, 0.06);
        border: 1px solid rgba(139, 92, 246, 0.25);
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .guide-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    :global(.guide-icon) {
        color: #a78bfa;
    }

    .guide-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: #f1f5f9;
    }

    .guide-desc {
        font-size: 0.8125rem;
        color: #94a3b8;
        line-height: 1.45;
        margin: 0;
    }

    .guide-steps {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .guide-step {
        display: flex;
        align-items: baseline;
        gap: 0.625rem;
        font-size: 0.8125rem;
        color: #cbd5e1;
        line-height: 1.4;
    }

    .step-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 18px;
        height: 18px;
        border-radius: 9999px;
        background: rgba(139, 92, 246, 0.25);
        color: #c084fc;
        font-size: 10.5px;
        font-weight: 700;
    }

    .guide-code {
        padding: 0.125rem 0.375rem;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        color: #e2e8f0;
        font-size: 0.75rem;
    }

    .guide-link {
        color: #a78bfa;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 2px;
    }

    .guide-link:hover {
        text-decoration: underline;
    }
</style>
