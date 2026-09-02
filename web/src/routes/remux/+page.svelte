<script lang="ts">
    import { t } from "$lib/i18n/translations";
    import { createRemuxPipeline } from "$lib/task-manager/queue";

    import DropReceiver from "$components/misc/DropReceiver.svelte";
    import FileReceiver from "$components/misc/FileReceiver.svelte";
    import BulletExplain from "$components/misc/BulletExplain.svelte";

    import IconRepeat from "@tabler/icons-svelte/IconRepeat.svelte";
    import IconDevices from "@tabler/icons-svelte/IconDevices.svelte";
    import IconInfoCircle from "@tabler/icons-svelte/IconInfoCircle.svelte";
    import IconScissors from "@tabler/icons-svelte/IconScissors.svelte";
    import IconClock from "@tabler/icons-svelte/IconClock.svelte";

    let draggedOver = $state(false);
    let files: FileList | undefined = $state();

    let enableTrim = $state(false);
    let trimStart = $state("00:00:00");
    let trimEnd = $state("");

    const remux = async () => {
        if (!files) return;

        const trimOptions = enableTrim ? {
            start: trimStart.trim() || undefined,
            end: trimEnd.trim() || undefined,
        } : undefined;

        for (let i = 0; i < files?.length; i++) {
            const type = files[i].type;
            // TODO: stricter type limits?
            if (type.startsWith("video/") || type.startsWith("audio/")) {
                createRemuxPipeline(files[i], trimOptions);
            }
        }

        files = undefined;
    };
</script>

<svelte:head>
    <title>{$t("tabs.remux")} ~ {$t("general.cobalt")}</title>
    <meta
        property="og:title"
        content="{$t('tabs.remux')} ~ {$t('general.cobalt')}"
    />
</svelte:head>

<DropReceiver bind:files bind:draggedOver onDrop={remux} id="remux-container">
    <div id="remux-open" tabindex="-1" data-first-focus>
        <div id="remux-receiver">
            <FileReceiver
                bind:draggedOver
                bind:files
                onImport={remux}
                acceptTypes={["video/*", "audio/*"]}
                acceptExtensions={[
                    "mp4",
                    "webm",
                    "mp3",
                    "ogg",
                    "opus",
                    "wav",
                    "m4a",
                ]}
            />

            <div class="local-trim-panel">
                <button
                    class="trim-toggle-btn"
                    class:active={enableTrim}
                    onclick={() => enableTrim = !enableTrim}
                    type="button"
                >
                    <IconScissors size={16} />
                    <span>{enableTrim ? "Disable Trimming" : "Trim Video Before Remux"}</span>
                </button>

                {#if enableTrim}
                    <div class="trim-inputs-row">
                        <div class="time-input-group">
                            <label for="remux-trim-start">
                                <IconClock size={12} />
                                <span>Start</span>
                            </label>
                            <input
                                id="remux-trim-start"
                                type="text"
                                placeholder="00:00:00"
                                bind:value={trimStart}
                            />
                        </div>
                        <div class="time-input-group">
                            <label for="remux-trim-end">
                                <IconClock size={12} />
                                <span>End</span>
                            </label>
                            <input
                                id="remux-trim-end"
                                type="text"
                                placeholder="e.g. 00:01:00"
                                bind:value={trimEnd}
                            />
                        </div>
                    </div>
                {/if}
            </div>
        </div>

        <div id="remux-bullets">
            <BulletExplain
                title={$t("remux.bullet.purpose.title")}
                description={$t("remux.bullet.purpose.description")}
                icon={IconRepeat}
            />

            <BulletExplain
                title="Trim & Cut"
                description="Losslessly trim unwanted sections from your videos and audio tracks directly in your browser."
                icon={IconScissors}
            />

            <BulletExplain
                title={$t("remux.bullet.privacy.title")}
                description={$t("remux.bullet.privacy.description")}
                icon={IconDevices}
            />
        </div>
    </div>
</DropReceiver>

<style>
    :global(#remux-container) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    #remux-open {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 48px;
    }

    #remux-receiver {
        max-width: 450px;
        display: flex;
        flex-direction: column;
        gap: var(--padding);
    }

    #remux-bullets {
        display: flex;
        flex-direction: column;
        gap: 18px;
        max-width: 450px;
    }

    @media screen and (max-width: 920px) {
        #remux-open {
            flex-direction: column;
            gap: var(--padding);
        }

        #remux-bullets {
            padding: var(--padding);
        }
    }

    @media screen and (max-width: 535px) {
        #remux-bullets {
            gap: var(--padding);
        }
    }

    .local-trim-panel {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        width: 100%;
    }

    .trim-toggle-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 999px;
        background: var(--button);
        color: var(--button-text);
        box-shadow: var(--button-box-shadow);
        font-size: 13px;
        font-weight: 500;
        transition: all 0.15s ease;
    }

    .trim-toggle-btn:hover {
        background: var(--button-hover);
        transform: translateY(-1px);
    }

    .trim-toggle-btn.active {
        background: var(--accent-primary);
        color: #ffffff;
        box-shadow: 0 0 16px var(--accent-glow);
    }

    .trim-inputs-row {
        display: flex;
        gap: 8px;
        width: 100%;
        animation: fadeIn 0.15s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-4px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .time-input-group {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
        text-align: left;
    }

    .time-input-group label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--gray);
    }

    .time-input-group input {
        width: 100%;
        box-sizing: border-box;
        padding: 5px 8px;
        border-radius: 8px;
        border: 1px solid var(--input-border);
        background: var(--button-hover-transparent);
        color: var(--secondary);
        font-size: 12px;
        outline: none;
    }

    .time-input-group input:focus {
        border-color: var(--accent-primary);
    }

    @media screen and (max-height: 750px) and (max-width: 535px) {
        :global(#remux-container:not(.processing)) {
            justify-content: start;
            align-items: start;
            padding-top: var(--padding);
        }
    }
</style>
