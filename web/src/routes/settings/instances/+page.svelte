<script lang="ts">
    import settings, { updateSetting } from "$lib/state/settings";
    import { t } from "$lib/i18n/translations";
    import { hapticSwitch } from "$lib/haptics";

    import SettingsInput from "$components/settings/SettingsInput.svelte";
    import SettingsToggle from "$components/buttons/SettingsToggle.svelte";
    import SettingsCategory from "$components/settings/SettingsCategory.svelte";
    import IconServer from "@tabler/icons-svelte/IconServer.svelte";
    import IconCheck from "@tabler/icons-svelte/IconCheck.svelte";

    const communityPresets = [
        { name: "Kwiatekm (Open)", url: "https://cobalt-api.kwiatekm.pl" },
        { name: "Streamrip (Open)", url: "https://api.streamrip.app" },
        { name: "XY2401 (Open)", url: "https://cobalt.xy2401.top" },
        { name: "Hyonsu (Open)", url: "https://cobaltapi.hyonsu.com" },
        { name: "Official (Requires Key)", url: "https://api.cobalt.tools" }
    ];

    function selectPreset(url: string) {
        hapticSwitch();
        updateSetting({
            processing: {
                enableCustomInstances: true,
                customInstanceURL: url
            }
        });
    }
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
                placeholder="https://instance.url.example/"
                showInstanceWarning
                altText={$t("settings.processing.custom_instance.input.alt_text")}
            />

            <!-- Quick Presets -->
            <div class="preset-section">
                <div class="preset-header">
                    <IconServer size={14} class="preset-icon" />
                    <span>Quick Community Instances:</span>
                </div>
                <div class="preset-grid">
                    {#each communityPresets as preset}
                        <button
                            type="button"
                            class="preset-btn"
                            class:active={$settings.processing.customInstanceURL === preset.url}
                            on:click={() => selectPreset(preset.url)}
                        >
                            {#if $settings.processing.customInstanceURL === preset.url}
                                <IconCheck size={13} class="check-icon" />
                            {/if}
                            <span>{preset.name}</span>
                        </button>
                    {/each}
                </div>
            </div>
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

<style>
    .category-inside-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .subtext {
        margin-top: -3px;
    }

    .preset-section {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 10px;
        margin-top: 4px;
    }

    .preset-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    :global(.preset-icon) {
        color: #a78bfa;
    }

    .preset-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .preset-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        font-size: 11.5px;
        font-weight: 500;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .preset-btn:hover {
        background: rgba(139, 92, 246, 0.15);
        border-color: rgba(139, 92, 246, 0.4);
        color: #ffffff;
    }

    .preset-btn.active {
        background: rgba(139, 92, 246, 0.25);
        border-color: #8b5cf6;
        color: #c084fc;
        font-weight: 600;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
    }

    :global(.check-icon) {
        color: #10b981;
    }
</style>
