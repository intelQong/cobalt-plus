---
name: Cobalt++ Modern Void
version: 1.0.0
description: High-contrast obsidian & void aesthetic designed for Cobalt++ media saving and video trimming. Features ambient radial luminescence, glassmorphism panels, neon violet and cyan accents, tactile pill controls, and crisp monospace details.
tokens:
  colors:
    canvas_dark: "#08080c"
    canvas_light: "#f8fafc"
    surface_dark: "rgba(255, 255, 255, 0.04)"
    surface_light: "rgba(0, 0, 0, 0.03)"
    surface_elevated_dark: "rgba(255, 255, 255, 0.07)"
    surface_elevated_light: "rgba(0, 0, 0, 0.06)"
    border_dark: "rgba(255, 255, 255, 0.1)"
    border_light: "rgba(0, 0, 0, 0.08)"
    border_focus: "#8b5cf6"
    accent_primary: "#8b5cf6"
    accent_glow: "rgba(139, 92, 246, 0.3)"
    accent_cyan: "#06b6d4"
    accent_emerald: "#10b981"
    accent_amber: "#f59e0b"
    accent_rose: "#f43f5e"
    text_primary_dark: "#f8fafc"
    text_primary_light: "#0f172a"
    text_secondary_dark: "#94a3b8"
    text_secondary_light: "#64748b"
  typography:
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    mono: "'IBM Plex Mono', 'Noto Sans Mono', monospace"
  radii:
    card: "18px"
    input: "14px"
    button: "12px"
    pill: "9999px"
  shadows:
    ambient_glow: "0 0 40px -10px rgba(139, 92, 246, 0.25)"
    glass_card: "0 8px 32px 0 rgba(0, 0, 0, 0.36)"
---

# Cobalt++ Design System (DESIGN.md)

## 1. Visual Theme & Atmosphere
Cobalt Modern Void delivers a futuristic, clean, and high-performance feel. The visual atmosphere combines obsidian/void surfaces with soft ambient radial glows and crisp glassmorphic elements. Micro-interactions should feel tactile, snappy, and responsive.

## 2. Color Palette & Roles
- **Canvas (`--bg-canvas`)**: Deep obsidian `#08080c` for dark theme, crisp clean `#f8fafc` for light theme.
- **Card Surface (`--bg-surface`)**: Translucent backdrop `rgba(255, 255, 255, 0.04)` with `backdrop-filter: blur(16px)`.
- **Primary Accent (`--accent-primary`)**: Neon violet `#8b5cf6` for main call-to-actions, focus rings, and active state highlights.
- **Secondary Accent (`--accent-cyan`)**: Cyan `#06b6d4` for trimming mode and secondary actions.
- **Status Colors**:
  - Success / Done: `#10b981` (Emerald)
  - Processing / Thinking: `#8b5cf6` (Neon Violet)
  - Warning: `#f59e0b` (Amber)
  - Error: `#f43f5e` (Rose)

## 3. Typography Rules
- **Display & Headings**: Clean modern sans-serif with tight tracking (`letter-spacing: -0.02em`).
- **Body & Controls**: Clean sans-serif with font-weight `500` or `600` for clear readability.
- **Data, Timestamps & Shortcuts**: Monospace font (`IBM Plex Mono`) for timestamps (`00:15 / 01:30`), keyboard shortcuts (`⌘V`, `Enter`, `T`), and file sizes.

## 4. Component Stylings
- **Omnibox (Main Input)**:
  - Glassmorphic card container with `1px` subtle border gradient.
  - On focus: luminous violet glow (`0 0 0 2px var(--accent-primary), 0 0 20px var(--accent-glow)`).
  - Integrated quick clear and download buttons with fluid scale feedback on click.
- **Video Trimmer Drawer**:
  - Compact collapsible drawer directly below or inside the Omnibox.
  - Dual time inputs with auto-formatted `hh:mm:ss` or `mm:ss` display.
  - Interactive dual-range scrubber bar with visual selection range fill.
  - Quick preset pills (Full, 15s, 30s, 60s).
- **Mode Switcher (Pill Switcher)**:
  - Segmented control with smooth pill highlight indicating active mode (`Auto`, `Audio`, `Mute`, `Trim`).
- **Service Badges**:
  - Frosted translucent pills with glowing border highlights on hover.

## 5. Layout Principles
- **Centered Hero Workspace**: Clean central column with responsive max-width (`680px`), balanced vertical whitespace, and ambient gradient backdrops.
- **Spacing Scale**: Consistent increments (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`).

## 6. Depth & Elevation
- **Level 0 (Canvas)**: Background with ambient radial gradient mask.
- **Level 1 (Card/Omnibox)**: Surface with `1px` translucent border and subtle shadow.
- **Level 2 (Popovers/Trimmer/Dialogs)**: Elevated frosted glass with drop shadow and border highlight.

## 7. Do's and Don'ts
- **DO**: Use monospace font for timestamps, durations, and keyboard shortcut chips.
- **DO**: Provide smooth CSS transitions (`cubic-bezier(0.16, 1, 0.3, 1)`) for hover and active states.
- **DON'T**: Use harsh opaque solid colors for containers; prefer subtle translucent glass surfaces.
- **DON'T**: Clutter the main screen with unnecessary text; keep the interface laser-focused on the URL input and actions.

## 8. Responsive Behavior
- **Desktop**: Full Omnibox width (up to `680px`), horizontal button switchers, and inline shortcut hints.
- **Mobile (<535px)**: Full-width stacked controls, larger touch targets (minimum `44px`), and bottom navigation bar.

## 9. Agent Prompt Guide
When generating or modifying UI components in this repository:
- Follow the token definitions in this `DESIGN.md`.
- Ensure all interactive elements have visible `:focus-visible` and hover feedback.
- Maintain dark/light mode compatibility using CSS custom properties.
