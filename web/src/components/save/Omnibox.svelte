<script lang="ts">
    import env, { officialApiURL } from "$lib/env";

    import { tick } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";

    import { t } from "$lib/i18n/translations";

    import dialogs from "$lib/state/dialogs";
    import { link, trimEnabled } from "$lib/state/omnibox";
    import { hapticSwitch } from "$lib/haptics";
    import { updateSetting } from "$lib/state/settings";
    import { savingHandler } from "$lib/api/saving-handler";
    import { pasteLinkFromClipboard } from "$lib/clipboard";
    import { turnstileEnabled, turnstileSolved } from "$lib/state/turnstile";

    import type { Optional } from "$lib/types/generic";
    import type { DownloadModeOption } from "$lib/types/settings";

    import ClearButton from "$components/save/buttons/ClearButton.svelte";
    import DownloadButton from "$components/save/buttons/DownloadButton.svelte";

    import Switcher from "$components/buttons/Switcher.svelte";
    import OmniboxIcon from "$components/save/OmniboxIcon.svelte";
    import ActionButton from "$components/buttons/ActionButton.svelte";
    import CaptchaTooltip from "$components/save/CaptchaTooltip.svelte";
    import SettingsButton from "$components/buttons/SettingsButton.svelte";
    import VideoTrimmer from "$components/save/VideoTrimmer.svelte";

    import IconMute from "$components/icons/Mute.svelte";
    import IconMusic from "$components/icons/Music.svelte";
    import IconSparkles from "$components/icons/Sparkles.svelte";
    import IconClipboard from "$components/icons/Clipboard.svelte";
    import IconScissors from "@tabler/icons-svelte/IconScissors.svelte";

    let linkInput: Optional<HTMLInputElement>;

    const validLink = (url: string) => {
        try {
            return /^https?\:/i.test(new URL(url).protocol);
        } catch {}
    };

    let isFocused = $state(false);
    let isDisabled = $state(false);
    let isLoading = $state(false);

    let isHovered = $state(false);

    let isBotCheckOngoing = $derived($turnstileEnabled && !$turnstileSolved);

    let linkPrefill = $derived(
        page.url.hash.replace("#", "")
        || (browser ? page.url.searchParams.get("u") : "")
        || ""
    );

    let downloadable = $derived(validLink($link));
    let clearVisible = $derived($link && !isLoading);

    $effect (() => {
        if (linkPrefill) {
            // prefilled link may be uri encoded
            linkPrefill = decodeURIComponent(linkPrefill);

            if (validLink(linkPrefill)) {
                $link = linkPrefill;
            }

            // clear hash and query to prevent bookmarking unwanted links
            if (browser) goto("/", { replaceState: true });

            // clear link prefill to avoid extra effects
            linkPrefill = "";

            savingHandler({ url: $link });
        }
    });

    const pasteClipboard = async () => {
        if ($dialogs.length > 0 || isDisabled || isLoading) {
            return;
        }

        hapticSwitch();

        const pastedData = await pasteLinkFromClipboard();
        if (!pastedData) return;

        const linkMatch = pastedData.match(/https?\:\/\/[^\s]+/g);

        if (linkMatch) {
            $link = linkMatch[0].split('，')[0];

            await tick(); // wait for button to render
            savingHandler({ url: $link });
        }
    };

    const toggleTrim = () => {
        hapticSwitch();
        $trimEnabled = !$trimEnabled;
    };

    const changeDownloadMode = (mode: DownloadModeOption) => {
        updateSetting({ save: { downloadMode: mode } });
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (!linkInput || $dialogs.length > 0 || isDisabled || isLoading) {
            return;
        }

        if (e.metaKey || e.ctrlKey || e.key === "/") {
            linkInput.focus();
        }

        if (e.key === "Enter" && validLink($link) && isFocused) {
            savingHandler({ url: $link });
        }

        if (["Escape", "Clear"].includes(e.key) && isFocused) {
            $link = "";
        }

        if (e.target === linkInput) {
            return;
        }

        switch (e.key) {
            case "D":
            case "d":
                pasteClipboard();
                break;
            case "T":
            case "t":
                toggleTrim();
                break;
            case "J":
            case "j":
                changeDownloadMode("auto");
                break;
            case "K":
            case "k":
                changeDownloadMode("audio");
                break;
            case "L":
            case "l":
                changeDownloadMode("mute");
                break;
            default:
                break;
        }
    };
</script>

<svelte:window onkeydown={handleKeydown} />

<!--
    if you want to remove the community instance label,
    refer to the license first https://github.com/imputnet/cobalt/tree/main/web#license
-->
{#if env.DEFAULT_API !== officialApiURL}
    <div id="instance-label">
        {$t("save.label.community_instance")}
    </div>
{/if}

<div id="omnibox">
    {#if $turnstileEnabled}
        <CaptchaTooltip
            visible={isBotCheckOngoing && (isHovered || isFocused)}
        />
    {/if}

    <div
        id="input-container"
        class:focused={isFocused}
        class:downloadable
        class:clear-visible={clearVisible}
    >
        <OmniboxIcon loading={isLoading || isBotCheckOngoing} />

        <input
            id="link-area"
            bind:value={$link}
            bind:this={linkInput}
            oninput={() => (isFocused = true)}
            onfocus={() => (isFocused = true)}
            onblur={() => (isFocused = false)}
            onmouseover={() => (isHovered = true)}
            onmouseleave={() => (isHovered = false)}
            spellcheck="false"
            autocomplete="off"
            autocapitalize="off"
            maxlength="512"
            placeholder={$t("save.input.placeholder")}
            aria-label={isBotCheckOngoing
                ? $t("a11y.save.link_area.turnstile")
                : $t("a11y.save.link_area")}
            data-form-type="other"
            disabled={isDisabled}
        />

        <ClearButton click={() => ($link = "")} />
        <DownloadButton
            url={$link}
            bind:disabled={isDisabled}
            bind:loading={isLoading}
        />
    </div>

    {#if $trimEnabled}
        <VideoTrimmer />
    {/if}

    <div id="action-container">
        <Switcher>
            <SettingsButton
                settingContext="save"
                settingId="downloadMode"
                settingValue="auto"
            >
                <IconSparkles />
                {$t("save.auto")}
            </SettingsButton>
            <SettingsButton
                settingContext="save"
                settingId="downloadMode"
                settingValue="audio"
            >
                <IconMusic />
                {$t("save.audio")}
            </SettingsButton>
            <SettingsButton
                settingContext="save"
                settingId="downloadMode"
                settingValue="mute"
            >
                <IconMute />
                {$t("save.mute")}
            </SettingsButton>
        </Switcher>

        <div id="extra-actions">
            <button
                id="trim-toggle"
                class="button action-pill"
                class:active={$trimEnabled}
                onclick={toggleTrim}
                title="Toggle video trim settings (T)"
                aria-label="Toggle video trim"
            >
                <IconScissors size={18} />
                <span class="action-btn-text">Trim</span>
            </button>

            <ActionButton id="paste" click={pasteClipboard}>
                <IconClipboard />
                <span id="paste-desktop-text">{$t("save.paste")}</span>
                <span id="paste-mobile-text">{$t("save.paste.long")}</span>
            </ActionButton>
        </div>
    </div>
</div>

<style>
    #omnibox {
        display: flex;
        flex-direction: column;
        max-width: 660px;
        width: 100%;
        gap: 8px;
        position: relative;
    }

    #input-container {
        --input-padding: 12px;
        display: flex;
        background: rgba(18, 18, 28, 0.7);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(139, 92, 246, 0.25);
        border-radius: var(--border-radius);
        align-items: center;
        gap: var(--input-padding);
        font-size: 14.5px;
        flex: 1;
        box-shadow: 0 8px 32px -8px rgba(0, 0, 0, 0.6);
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #input-container:hover {
        border-color: rgba(139, 92, 246, 0.45);
        box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.7),
                    0 0 20px rgba(139, 92, 246, 0.2);
    }

    #input-container:not(.clear-visible) :global(#clear-button) {
        display: none;
    }

    #input-container:not(.downloadable) :global(#download-button) {
        display: none;
    }

    #input-container.clear-visible {
        padding-right: var(--input-padding);
    }

    :global([dir="rtl"]) #input-container.clear-visible {
        padding-right: unset;
        padding-left: var(--input-padding);
    }

    #input-container.downloadable {
        padding-right: 0;
    }

    #input-container.downloadable:dir(rtl) {
        padding-left: 0;
    }

    #input-container.focused {
        border-color: var(--accent-primary);
        outline: var(--accent-primary) 2px solid;
        outline-offset: -1px;
        box-shadow: 0 12px 40px -8px rgba(0, 0, 0, 0.8),
                    0 0 32px var(--accent-glow);
    }

    #input-container.focused :global(#input-icons svg) {
        stroke: var(--accent-primary);
    }

    #input-container.downloadable :global(#input-icons svg) {
        stroke: var(--secondary);
    }

    #link-area {
        display: flex;
        width: 100%;
        margin: 0;
        padding: var(--input-padding) 0;
        padding-left: calc(var(--input-padding) + 28px);
        height: 20px;

        align-items: center;

        border: none;
        outline: none;
        background-color: transparent;
        color: var(--secondary);

        -webkit-tap-highlight-color: transparent;
        flex: 1;

        font-weight: 500;

        /* workaround for safari */
        font-size: inherit;

        /* prevents input from poking outside of rounded corners */
        border-radius: var(--border-radius);
    }

    :global([dir="rtl"]) #link-area {
        padding-left: unset;
        padding-right: calc(var(--input-padding) + 28px);
    }

    #link-area::placeholder {
        color: var(--gray);
        /* fix for firefox */
        opacity: 0.8;
    }

    /* fix for safari */
    input:disabled {
        opacity: 1;
    }

    #action-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    #extra-actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
    }

    .action-pill {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 6px 12px;
        border-radius: var(--border-radius);
        background: var(--button);
        color: var(--button-text);
        box-shadow: var(--button-box-shadow);
        font-size: 13.5px;
        font-weight: 500;
        transition: all 0.15s ease;
    }

    .action-pill:hover {
        background: var(--button-hover);
    }

    .action-pill.active {
        background: var(--accent-primary);
        color: #ffffff;
        box-shadow: 0 0 16px var(--accent-glow);
    }

    #paste-mobile-text {
        display: none;
    }

    #instance-label {
        font-size: 13px;
        color: var(--gray);
        font-weight: 500;
    }

    @media screen and (max-width: 535px) {
        #action-container {
            flex-direction: column;
            gap: 6px;
        }

        #action-container :global(#switcher) {
            width: 100%;
        }

        #extra-actions {
            width: 100%;
        }

        #extra-actions :global(.button),
        #extra-actions .action-pill {
            flex: 1;
            justify-content: center;
        }

        #paste-mobile-text {
            display: block;
        }

        #paste-desktop-text {
            display: none;
        }
    }
</style>
