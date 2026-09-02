<script lang="ts">
    import { trimStart, trimEnd, trimEnabled } from "$lib/state/omnibox";
    import { hapticSwitch } from "$lib/haptics";
    import IconScissors from "@tabler/icons-svelte/IconScissors.svelte";
    import IconClock from "@tabler/icons-svelte/IconClock.svelte";
    import IconRestore from "@tabler/icons-svelte/IconRestore.svelte";

    // Duration helper: parses hh:mm:ss or mm:ss to seconds
    const parseTimeToSeconds = (t: string): number => {
        if (!t) return 0;
        const parts = t.trim().split(":").map(Number);
        if (parts.some(isNaN)) return 0;
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1) return parts[0];
        return 0;
    };

    // Seconds to formatted string hh:mm:ss
    const formatSecondsToTime = (sec: number): string => {
        if (isNaN(sec) || sec < 0) return "00:00:00";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    let startSeconds = $derived(parseTimeToSeconds($trimStart));
    let endSeconds = $derived($trimEnd ? parseTimeToSeconds($trimEnd) : 0);

    let trimmedDuration = $derived.by(() => {
        if (!endSeconds || endSeconds <= startSeconds) return "";
        const diff = endSeconds - startSeconds;
        return formatSecondsToTime(diff);
    });

    // Preset helper
    const applyPreset = (durationSec: number | null) => {
        hapticSwitch();
        if (durationSec === null) {
            $trimStart = "00:00:00";
            $trimEnd = "";
            return;
        }
        $trimStart = "00:00:00";
        $trimEnd = formatSecondsToTime(durationSec);
    };

    const resetTrim = () => {
        hapticSwitch();
        $trimStart = "00:00:00";
        $trimEnd = "";
    };
</script>

<div class="trimmer-card" class:active={$trimEnabled}>
    <div class="trimmer-header">
        <div class="header-title">
            <IconScissors size={18} class="accent-icon" />
            <span class="title-text">Video Trimmer</span>
            {#if trimmedDuration}
                <span class="duration-badge">{trimmedDuration}</span>
            {/if}
        </div>
        <button class="reset-btn" onclick={resetTrim} title="Reset trim timestamps" aria-label="Reset trim">
            <IconRestore size={14} />
            <span>Reset</span>
        </button>
    </div>

    <div class="time-inputs-container">
        <div class="time-field">
            <label for="trim-start-input">
                <IconClock size={14} />
                <span>Start</span>
            </label>
            <input
                id="trim-start-input"
                type="text"
                placeholder="00:00:00"
                bind:value={$trimStart}
                spellcheck="false"
                autocomplete="off"
            />
        </div>

        <div class="time-divider">to</div>

        <div class="time-field">
            <label for="trim-end-input">
                <IconClock size={14} />
                <span>End</span>
            </label>
            <input
                id="trim-end-input"
                type="text"
                placeholder="e.g. 00:01:30"
                bind:value={$trimEnd}
                spellcheck="false"
                autocomplete="off"
            />
        </div>
    </div>

    <div class="presets-row">
        <span class="presets-label">Presets:</span>
        <button class="preset-pill" onclick={() => applyPreset(null)} class:active={!$trimEnd}>
            Full Video
        </button>
        <button class="preset-pill" onclick={() => applyPreset(15)} class:active={endSeconds - startSeconds === 15}>
            15s
        </button>
        <button class="preset-pill" onclick={() => applyPreset(30)} class:active={endSeconds - startSeconds === 30}>
            30s
        </button>
        <button class="preset-pill" onclick={() => applyPreset(60)} class:active={endSeconds - startSeconds === 60}>
            60s
        </button>
    </div>
</div>

<style>
    .trimmer-card {
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 12px 14px;
        border-radius: var(--border-radius);
        background: var(--popup-bg);
        border: 1px solid var(--button-stroke);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        backdrop-filter: blur(12px);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .trimmer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary);
    }

    :global(.accent-icon) {
        color: var(--accent-primary);
    }

    .duration-badge {
        font-size: 11px;
        padding: 2px 7px;
        border-radius: 999px;
        background: var(--accent-glow);
        color: var(--accent-primary);
        font-weight: 600;
        letter-spacing: 0.02em;
    }

    .reset-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 500;
        background: transparent;
        color: var(--gray);
        border-radius: 6px;
        box-shadow: none;
        transition: color 0.15s, background 0.15s;
    }

    .reset-btn:hover {
        color: var(--secondary);
        background: var(--button-hover-transparent);
    }

    .time-inputs-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .time-field {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .time-field label {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        font-weight: 500;
        color: var(--gray);
    }

    .time-field input {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid var(--input-border);
        background: var(--button-hover-transparent);
        color: var(--secondary);
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
    }

    .time-field input:focus {
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 2px var(--accent-glow);
    }

    .time-divider {
        font-size: 12px;
        font-weight: 500;
        color: var(--gray);
        margin-top: 16px;
    }

    .presets-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
    }

    .presets-label {
        font-size: 11px;
        color: var(--gray);
        font-weight: 500;
    }

    .preset-pill {
        padding: 3px 9px;
        font-size: 11px;
        font-weight: 500;
        border-radius: 999px;
        background: var(--button);
        color: var(--button-text);
        box-shadow: 0 0 0 1px var(--button-stroke) inset;
        transition: all 0.15s ease;
    }

    .preset-pill:hover {
        background: var(--button-hover);
        transform: translateY(-1px);
    }

    .preset-pill.active {
        background: var(--accent-primary);
        color: #ffffff;
        box-shadow: 0 0 12px var(--accent-glow);
    }

    @media screen and (max-width: 440px) {
        .time-inputs-container {
            flex-direction: column;
            gap: 6px;
        }

        .time-divider {
            display: none;
        }
    }
</style>
