<script lang="ts">
    import { t } from "$lib/i18n/translations";
    import Omnibox from "$components/save/Omnibox.svelte";
    import SupportedServices from "$components/save/SupportedServices.svelte";
    import { trimEnabled, link } from "$lib/state/omnibox";
    import IconScissors from "@tabler/icons-svelte/IconScissors.svelte";
    import IconSparkles from "@tabler/icons-svelte/IconSparkles.svelte";
    import IconLock from "@tabler/icons-svelte/IconLock.svelte";
    import IconBolt from "@tabler/icons-svelte/IconBolt.svelte";
</script>

<svelte:head>
    <title>Cobalt++ — Media Saver & Video Trimmer</title>
    <meta property="og:title" content="Cobalt++ — Media Saver & Video Trimmer" />
</svelte:head>

<div id="cobalt-save-container" class="center-column-container">
    <!-- Ambient glowing mesh lights -->
    <div class="ambient-glow primary-glow" aria-hidden="true"></div>
    <div class="ambient-glow cyan-glow" aria-hidden="true"></div>

    <SupportedServices />

    <main id="cobalt-save" tabindex="-1" data-first-focus>
        <!-- Hero Header -->
        <div class="hero-header">
            <div class="brand-badge">
                <span class="pulse-dot"></span>
                <span>Cobalt 11.7.1 Enhanced</span>
            </div>

            <div class="brand-title-row">
                <h1 class="brand-title">
                    cobalt<span class="neon-plus">++</span>
                </h1>
            </div>

            <p class="brand-tagline">
                The ultimate ad-free media downloader with <span class="highlight-text">in-browser video trimming</span>
            </p>

            <div class="feature-pills">
                <div class="feature-pill">
                    <IconScissors size={14} class="pill-icon" />
                    <span>Video Trimmer</span>
                </div>
                <div class="feature-pill">
                    <IconBolt size={14} class="pill-icon" />
                    <span>yt-dlp Engine</span>
                </div>
                <div class="feature-pill">
                    <IconLock size={14} class="pill-icon" />
                    <span>Passkey Protected</span>
                </div>
                <div class="feature-pill">
                    <IconSparkles size={14} class="pill-icon" />
                    <span>4K & MP3</span>
                </div>
            </div>
        </div>

        <!-- Omnibox & Controls -->
        <Omnibox />

        <!-- Keyboard Shortcuts Hint Bar -->
        <div class="shortcuts-hint">
            <span class="shortcut-chip"><kbd>⌘V</kbd> Paste</span>
            <span class="shortcut-separator">•</span>
            <span class="shortcut-chip"><kbd>T</kbd> Toggle Trimmer</span>
            <span class="shortcut-separator">•</span>
            <span class="shortcut-chip"><kbd>↵</kbd> Save / Download</span>
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
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
        justify-content: space-between;
    }

    .ambient-glow {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        filter: blur(90px);
        border-radius: 50%;
    }

    .primary-glow {
        top: 20%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 650px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0.04) 55%, transparent 75%);
    }

    .cyan-glow {
        bottom: 15%;
        left: 55%;
        transform: translate(-50%, 0);
        width: 500px;
        height: 300px;
        background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
    }

    #cobalt-save {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin: auto 0;
        gap: 20px;
        position: relative;
        z-index: 1;
        max-width: 680px;
        align-self: center;
    }

    .hero-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 10px;
        margin-bottom: 4px;
    }

    .brand-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 9999px;
        background: rgba(139, 92, 246, 0.12);
        border: 1px solid rgba(139, 92, 246, 0.3);
        color: #c084fc;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.03em;
        text-transform: uppercase;
    }

    .pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
        animation: pulse-dot 2s infinite;
    }

    @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.8); }
    }

    .brand-title-row {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .brand-title {
        font-size: 2.75rem;
        font-weight: 800;
        letter-spacing: -0.04em;
        color: var(--secondary);
        margin: 0;
        line-height: 1;
        font-family: inherit;
    }

    .neon-plus {
        display: inline-block;
        color: #8b5cf6;
        background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #06b6d4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: drop-shadow(0 0 16px rgba(139, 92, 246, 0.75));
        margin-left: 2px;
        font-weight: 900;
    }

    .brand-tagline {
        font-size: 0.95rem;
        color: var(--gray);
        margin: 0;
        max-width: 480px;
        line-height: 1.45;
    }

    .highlight-text {
        color: #a78bfa;
        font-weight: 500;
    }

    .feature-pills {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 4px;
    }

    .feature-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 10px;
        background: var(--button-hover-transparent);
        border: 1px solid var(--button-stroke);
        border-radius: 8px;
        font-size: 11.5px;
        color: var(--secondary);
        font-weight: 500;
        backdrop-filter: blur(8px);
        transition: all 0.15s ease;
    }

    .feature-pill:hover {
        border-color: rgba(139, 92, 246, 0.4);
        background: rgba(139, 92, 246, 0.08);
        transform: translateY(-1px);
    }

    :global(.pill-icon) {
        color: #a78bfa;
    }

    .shortcuts-hint {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 11.5px;
        color: var(--gray);
        font-weight: 500;
        margin-top: 2px;
        opacity: 0.85;
    }

    .shortcuts-hint kbd {
        display: inline-block;
        padding: 2px 6px;
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
        color: var(--gray);
        font-size: 12px;
        text-align: center;
        padding-bottom: 8px;
        font-weight: 500;
        position: relative;
        z-index: 1;
    }

    @media screen and (max-width: 535px) {
        .brand-title {
            font-size: 2.1rem;
        }

        .brand-tagline {
            font-size: 0.85rem;
            padding: 0 1rem;
        }

        .feature-pills {
            display: none;
        }

        .shortcuts-hint {
            display: none;
        }

        .primary-glow {
            width: 320px;
            height: 220px;
        }
    }
</style>
