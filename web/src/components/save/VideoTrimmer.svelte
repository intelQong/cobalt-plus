<script lang="ts">
    import { trimStart, trimEnd, trimEnabled } from "$lib/state/omnibox";
    import { hapticSwitch } from "$lib/haptics";
    import IconScissors from "@tabler/icons-svelte/IconScissors.svelte";
    import IconClock from "@tabler/icons-svelte/IconClock.svelte";
    import IconRestore from "@tabler/icons-svelte/IconRestore.svelte";
    import IconPlayerPlay from "@tabler/icons-svelte/IconPlayerPlay.svelte";
    import IconChevronLeft from "@tabler/icons-svelte/IconChevronLeft.svelte";
    import IconChevronRight from "@tabler/icons-svelte/IconChevronRight.svelte";

    // Max timeline scale in seconds (default 10 minutes = 600s, can switch to 1h = 3600s)
    let maxTimelineSeconds = $state(600);

    // Helpers
    const parseTimeToSeconds = (t: string): number => {
        if (!t) return 0;
        const parts = t.trim().split(":").map(Number);
        if (parts.some(isNaN)) return 0;
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        if (parts.length === 1) return parts[0];
        return 0;
    };

    const formatSecondsToTime = (sec: number): string => {
        if (isNaN(sec) || sec < 0) return "00:00:00";
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    const formatShortTime = (sec: number): string => {
        if (isNaN(sec) || sec < 0) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${m}:${pad(s)}`;
    };

    let startSec = $derived(parseTimeToSeconds($trimStart));
    let endSec = $derived($trimEnd ? parseTimeToSeconds($trimEnd) : maxTimelineSeconds);

    // Ensure timeline max fits current endSec
    $effect(() => {
        if (endSec > maxTimelineSeconds) {
            maxTimelineSeconds = Math.max(endSec + 120, 1800);
        }
    });

    let startPercent = $derived(Math.min(100, Math.max(0, (startSec / maxTimelineSeconds) * 100)));
    let endPercent = $derived(Math.min(100, Math.max(0, (endSec / maxTimelineSeconds) * 100)));
    let rangeWidth = $derived(Math.max(0, endPercent - startPercent));

    let trimmedDuration = $derived.by(() => {
        if (!$trimEnd || endSec <= startSec) return "Full Video";
        const diff = endSec - startSec;
        return formatSecondsToTime(diff);
    });

    function handleStartSlider(e: Event) {
        const val = Number((e.target as HTMLInputElement).value);
        const clamped = Math.min(val, endSec - 1);
        $trimStart = formatSecondsToTime(Math.max(0, clamped));
    }

    function handleEndSlider(e: Event) {
        const val = Number((e.target as HTMLInputElement).value);
        const clamped = Math.max(val, startSec + 1);
        $trimEnd = formatSecondsToTime(clamped);
    }

    function adjustStart(delta: number) {
        hapticSwitch();
        const next = Math.max(0, Math.min(startSec + delta, endSec - 1));
        $trimStart = formatSecondsToTime(next);
    }

    function adjustEnd(delta: number) {
        hapticSwitch();
        const next = Math.max(startSec + 1, Math.min(endSec + delta, maxTimelineSeconds));
        $trimEnd = formatSecondsToTime(next);
    }

    function applyPreset(durationSec: number | null) {
        hapticSwitch();
        if (durationSec === null) {
            $trimStart = "00:00:00";
            $trimEnd = "";
            return;
        }
        $trimStart = "00:00:00";
        $trimEnd = formatSecondsToTime(durationSec);
    }

    function resetTrim() {
        hapticSwitch();
        $trimStart = "00:00:00";
        $trimEnd = "";
    }
</script>

<div class="trimmer-card" class:active={$trimEnabled}>
    <!-- Top Header -->
    <div class="trimmer-header">
        <div class="header-title">
            <div class="scissor-icon-wrap">
                <IconScissors size={18} />
            </div>
            <span class="title-text">Precision Slider Trimmer</span>
            <span class="duration-badge">{trimmedDuration}</span>
        </div>
        <button class="reset-btn" onclick={resetTrim} title="Reset trim timestamps" aria-label="Reset trim">
            <IconRestore size={14} />
            <span>Reset</span>
        </button>
    </div>

    <!-- Dual Range Slider Track -->
    <div class="slider-wrapper">
        <div class="timeline-labels">
            <span class="time-marker">0:00</span>
            <span class="time-marker">{formatShortTime(maxTimelineSeconds * 0.25)}</span>
            <span class="time-marker">{formatShortTime(maxTimelineSeconds * 0.5)}</span>
            <span class="time-marker">{formatShortTime(maxTimelineSeconds * 0.75)}</span>
            <span class="time-marker">{formatShortTime(maxTimelineSeconds)}</span>
        </div>

        <div class="timeline-track-container">
            <!-- Background base rail -->
            <div class="timeline-rail"></div>

            <!-- Glowing highlighted range span -->
            <div
                class="timeline-range-highlight"
                style="left: {startPercent}%; width: {rangeWidth}%;"
            >
                <div class="range-glow"></div>
            </div>

            <!-- Start Slider Input -->
            <input
                type="range"
                min="0"
                max={maxTimelineSeconds}
                step="1"
                value={startSec}
                oninput={handleStartSlider}
                class="range-slider range-start"
                aria-label="Trim Start Time"
            />

            <!-- End Slider Input -->
            <input
                type="range"
                min="0"
                max={maxTimelineSeconds}
                step="1"
                value={endSec}
                oninput={handleEndSlider}
                class="range-slider range-end"
                aria-label="Trim End Time"
            />
        </div>
    </div>

    <!-- Dual Time Controls with Step Adjusters -->
    <div class="time-inputs-container">
        <!-- Start Time Box -->
        <div class="time-box">
            <div class="time-box-header">
                <span class="box-label">START</span>
                <span class="active-time">{$trimStart}</span>
            </div>
            <div class="step-buttons">
                <button type="button" class="step-btn" onclick={() => adjustStart(-5)} title="-5s">-5s</button>
                <button type="button" class="step-btn" onclick={() => adjustStart(-1)} title="-1s">-1s</button>
                <button type="button" class="step-btn" onclick={() => adjustStart(1)} title="+1s">+1s</button>
                <button type="button" class="step-btn" onclick={() => adjustStart(5)} title="+5s">+5s</button>
            </div>
        </div>

        <div class="time-divider">
            <div class="divider-line"></div>
            <span>TO</span>
            <div class="divider-line"></div>
        </div>

        <!-- End Time Box -->
        <div class="time-box">
            <div class="time-box-header">
                <span class="box-label">END</span>
                <span class="active-time">{$trimEnd || formatSecondsToTime(maxTimelineSeconds)}</span>
            </div>
            <div class="step-buttons">
                <button type="button" class="step-btn" onclick={() => adjustEnd(-5)} title="-5s">-5s</button>
                <button type="button" class="step-btn" onclick={() => adjustEnd(-1)} title="-1s">-1s</button>
                <button type="button" class="step-btn" onclick={() => adjustEnd(1)} title="+1s">+1s</button>
                <button type="button" class="step-btn" onclick={() => adjustEnd(5)} title="+5s">+5s</button>
            </div>
        </div>
    </div>

    <!-- Quick Presets -->
    <div class="presets-row">
        <span class="presets-label">Quick:</span>
        <button
            class="preset-pill"
            onclick={() => applyPreset(null)}
            class:active={!$trimEnd}
        >
            Full Video
        </button>
        <button
            class="preset-pill"
            onclick={() => applyPreset(15)}
            class:active={$trimEnd && endSec - startSec === 15}
        >
            15s
        </button>
        <button
            class="preset-pill"
            onclick={() => applyPreset(30)}
            class:active={$trimEnd && endSec - startSec === 30}
        >
            30s
        </button>
        <button
            class="preset-pill"
            onclick={() => applyPreset(60)}
            class:active={$trimEnd && endSec - startSec === 60}
        >
            60s
        </button>
        <button
            class="preset-pill"
            onclick={() => applyPreset(180)}
            class:active={$trimEnd && endSec - startSec === 180}
        >
            3 min
        </button>
    </div>
</div>

<style>
    .trimmer-card {
        display: flex;
        flex-direction: column;
        gap: 14px;
        padding: 16px 18px;
        border-radius: 16px;
        background: rgba(18, 18, 28, 0.85);
        border: 1px solid rgba(139, 92, 246, 0.3);
        box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.6),
                    0 0 24px -6px rgba(139, 92, 246, 0.25);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-6px);
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
        gap: 10px;
    }

    .scissor-icon-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 8px;
        background: rgba(139, 92, 246, 0.15);
        color: #a78bfa;
        border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .title-text {
        font-size: 14px;
        font-weight: 600;
        color: #f8fafc;
        letter-spacing: -0.01em;
    }

    .duration-badge {
        font-size: 11.5px;
        font-weight: 700;
        font-family: inherit;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%);
        border: 1px solid rgba(139, 92, 246, 0.4);
        color: #c084fc;
        padding: 2px 8px;
        border-radius: 6px;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
    }

    .reset-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--gray);
        font-size: 11.5px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .reset-btn:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
    }

    /* Slider Track Styles */
    .slider-wrapper {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 4px 2px;
    }

    .timeline-labels {
        display: flex;
        justify-content: space-between;
        font-size: 10.5px;
        color: var(--gray);
        font-family: inherit;
        padding: 0 4px;
    }

    .timeline-track-container {
        position: relative;
        height: 32px;
        display: flex;
        align-items: center;
    }

    .timeline-rail {
        position: absolute;
        inset: 10px 0;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .timeline-range-highlight {
        position: absolute;
        top: 10px;
        bottom: 10px;
        background: linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%);
        border-radius: 9999px;
        pointer-events: none;
        z-index: 1;
        box-shadow: 0 0 14px rgba(139, 92, 246, 0.6);
    }

    .range-glow {
        position: absolute;
        inset: 0;
        background: inherit;
        filter: blur(4px);
        opacity: 0.5;
        border-radius: inherit;
    }

    /* Dual Range Slider Inputs Overlaid */
    .range-slider {
        position: absolute;
        width: 100%;
        height: 32px;
        top: 0;
        left: 0;
        margin: 0;
        background: none;
        pointer-events: none;
        -webkit-appearance: none;
        appearance: none;
        z-index: 2;
    }

    .range-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: auto;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #ffffff;
        border: 3px solid #8b5cf6;
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.8), 0 2px 6px rgba(0, 0, 0, 0.5);
        cursor: grab;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .range-slider::-moz-range-thumb {
        pointer-events: auto;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #ffffff;
        border: 3px solid #8b5cf6;
        box-shadow: 0 0 12px rgba(139, 92, 246, 0.8), 0 2px 6px rgba(0, 0, 0, 0.5);
        cursor: grab;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .range-slider::-webkit-slider-thumb:hover,
    .range-slider::-webkit-slider-thumb:active {
        transform: scale(1.2);
        box-shadow: 0 0 18px rgba(139, 92, 246, 1), 0 3px 10px rgba(0, 0, 0, 0.6);
        cursor: grabbing;
    }

    /* Time Control Boxes */
    .time-inputs-container {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: 12px;
        align-items: center;
    }

    .time-box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 10px 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
    }

    .time-box-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .box-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: #a78bfa;
    }

    .active-time {
        font-size: 14px;
        font-weight: 700;
        font-family: inherit;
        color: #f8fafc;
    }

    .step-buttons {
        display: flex;
        gap: 4px;
    }

    .step-btn {
        flex: 1;
        padding: 4px 0;
        font-size: 10.5px;
        font-weight: 600;
        font-family: inherit;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        cursor: pointer;
        transition: all 0.12s ease;
    }

    .step-btn:hover {
        background: rgba(139, 92, 246, 0.2);
        border-color: rgba(139, 92, 246, 0.4);
        color: #ffffff;
    }

    .time-divider {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        color: var(--gray);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.05em;
    }

    .divider-line {
        width: 1px;
        height: 12px;
        background: rgba(255, 255, 255, 0.1);
    }

    /* Presets Row */
    .presets-row {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
    }

    .presets-label {
        font-size: 11px;
        font-weight: 600;
        color: var(--gray);
        margin-right: 2px;
    }

    .preset-pill {
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 500;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #94a3b8;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .preset-pill:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
    }

    .preset-pill.active {
        background: rgba(139, 92, 246, 0.2);
        border-color: rgba(139, 92, 246, 0.5);
        color: #c084fc;
        font-weight: 600;
    }

    @media screen and (max-width: 535px) {
        .time-inputs-container {
            grid-template-columns: 1fr;
            gap: 8px;
        }

        .time-divider {
            display: none;
        }
    }
</style>
