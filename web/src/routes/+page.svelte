<script>
    import { t } from "$lib/i18n/translations";

    import Omnibox from "$components/save/Omnibox.svelte";
    import Meowbalt from "$components/misc/Meowbalt.svelte";
    import SupportedServices from "$components/save/SupportedServices.svelte";
</script>

<svelte:head>
    <title>{$t("general.cobalt")}</title>
    <meta property="og:title" content={$t("general.cobalt")} />
</svelte:head>

<div id="cobalt-save-container" class="center-column-container">
    <div class="ambient-glow" aria-hidden="true"></div>
    <SupportedServices />
    <main
        id="cobalt-save"
        tabindex="-1"
        data-first-focus
    >
        <div class="meowbalt-wrapper">
            <Meowbalt emotion="smile" />
        </div>
        <Omnibox />
        
        <div class="shortcuts-hint">
            <span class="shortcut-chip"><kbd>⌘V</kbd> Paste</span>
            <span class="shortcut-separator">•</span>
            <span class="shortcut-chip"><kbd>T</kbd> Trim</span>
            <span class="shortcut-separator">•</span>
            <span class="shortcut-chip"><kbd>↵</kbd> Save</span>
        </div>
    </main>
    <div id="terms-note">
        {$t("save.terms.note.agreement")}
        <a href="/about/terms">{$t("save.terms.note.link")}</a>
    </div>
</div>

<style>
    #cobalt-save-container {
        padding: var(--padding);
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
    }

    .ambient-glow {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 350px;
        background: radial-gradient(circle, var(--accent-glow) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 75%);
        pointer-events: none;
        z-index: 0;
        filter: blur(40px);
        opacity: 0.6;
    }

    #cobalt-save {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        gap: 16px;
        position: relative;
        z-index: 1;
    }

    .meowbalt-wrapper {
        transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .meowbalt-wrapper:hover {
        transform: scale(1.04);
    }

    .shortcuts-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11.5px;
        color: var(--gray);
        font-weight: 500;
        margin-top: 4px;
        opacity: 0.8;
    }

    .shortcuts-hint kbd {
        display: inline-block;
        padding: 1px 5px;
        font-size: 10.5px;
        font-family: inherit;
        background: var(--button-elevated);
        border: 1px solid var(--button-stroke);
        border-radius: 4px;
        color: var(--secondary);
    }

    .shortcut-separator {
        color: var(--button-stroke);
    }

    #terms-note {
        bottom: 0;
        color: var(--gray);
        font-size: 12px;
        text-align: center;
        padding-bottom: 6px;
        font-weight: 500;
        position: relative;
        z-index: 1;
    }

    @media screen and (max-width: 535px) {
        #cobalt-save-container {
            padding-top: calc(var(--padding) / 2);
        }

        .ambient-glow {
            width: 320px;
            height: 220px;
        }

        .shortcuts-hint {
            display: none;
        }

        #terms-note {
            font-size: 11px;
            padding-bottom: 0;
        }
    }
</style>
