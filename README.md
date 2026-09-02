<div align="center">
  <br />
  <p>
    <img src="web/static/favicon.png" title="Cobalt++" alt="Cobalt++ logo" width="100" />
  </p>
  <h1>cobalt++</h1>
  <p>
    <strong>The ultimate open-source media saver and video trimmer — fast, privacy-focused, and ad-free.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/version-11.7.1-8b5cf6?style=flat-square" alt="Version" />
    <img src="https://img.shields.io/badge/platforms-Web%20%7C%20Docker%20%7C%20CLI-06b6d4?style=flat-square" alt="Platforms" />
    <img src="https://img.shields.io/badge/license-AGPL--3.0-emerald?style=flat-square" alt="License" />
    <img src="https://img.shields.io/badge/deployment-Cloudflare%20Pages-f38020?style=flat-square" alt="Cloudflare Pages" />
  </p>
  <br />
</div>

---

## ⚡ What is Cobalt++?

**Cobalt++** is an enhanced, high-performance web and CLI application to save, remux, and trim media from YouTube, Twitter/X, TikTok, Instagram, Reddit, and dozens of other platforms without ads, trackers, paywalls, or bloat.

Paste the link, adjust your trim timestamps with the interactive timeline slider, download, and move on.

---

## ✨ Features & Highlights

### 🎚️ Dual-Handle Slider-Style Video Trimmer
- **Dual Range Timeline Track:** Drag the Start handle and End handle freely along a glowing violet gradient range track.
- **Dynamic Timeline Scaling:** Auto-scales from short clips up to full-length videos.
- **Precision Step Adjusters:** Fine-tune with dedicated `[-5s]`, `[-1s]`, `[+1s]`, `[+5s]` buttons.
- **Direct Timestamp Typing:** Click and type exact timestamps (`00:01:45`) or drag thumbs seamlessly.
- **Quick Presets:** Instant duration pills for `Full Video`, `15s`, `30s`, `60s`, and `3 min`.
- **In-Browser WebAssembly Processing:** Zero-server video trimming powered by `libav.js`.

### 🌐 Embedded Open Community Backends & Auto-Failover
- **Pre-Configured Instance Pool:** Works out of the box with zero server setup using fast, open community instances.
- **Automatic High-Availability Failover:** If an instance experiences downtime or rate limits, requests automatically rotate to the next healthy backend without user interruption.
- **Custom Instance Support:** Easily switch between public or self-hosted instances in **Settings ➔ Instances**.

### 🔐 WebAuthn Passkeys & Cloudflare Zero Trust (Access)
- **Biometric Passkey Access Control:** Restrict app access using **Touch ID, Face ID, Windows Hello, or YubiKey**.
- **Obsidian Lock Screen:** Clean biometric unlock overlay with keyboard shortcuts (`↵` / `Space`).
- **Cloudflare Access Identity Detection:** Seamlessly integrates with Cloudflare Zero Trust edge policies.

### 🎨 Clean Modern Void UI (`awesome-design-md`)
- **Obsidian Dark Theme (`#08080c`)** with subtle ambient luminescence.
- **Glassmorphic Omnibox** with radiant focus rings.
- **Keyboard Shortcuts:** `⌘V` (Paste), `T` (Toggle Trimmer), `↵` (Save).

### 💻 Terminal Trimming CLI (`cli.js`)
- Save and trim media directly from the command line:
  ```bash
  node cli.js "https://youtube.com/watch?v=..." --ss 00:00:15 --to 00:00:45
  ```

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/intelQong/cobalt-plus.git
cd cobalt-plus

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm --filter @imput/cobalt-web dev
```

Visit `http://localhost:5173` to explore the app!

---

## ☁️ Deploy to Cloudflare Pages (100% Free)

You can host the static frontend on Cloudflare Pages for free with global CDN caching:

### Method 1: Connect via Cloudflare Dashboard (Recommended)
1. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** ➔ **Workers & Pages** ➔ **Create application** ➔ **Pages** ➔ **Connect to Git**.
2. Select your repository.
3. Set the build configuration:
   - **Framework preset:** `None`
   - **Build command:** `pnpm --filter @imput/cobalt-web build`
   - **Build output directory:** `web/build`
   - **Root directory:** `/`
4. Set Environment Variables under **Settings ➔ Environment variables**:
   - `NODE_VERSION` = `20`
5. Click **Save and Deploy**. Your site will be live on a free `*.pages.dev` subdomain!

---

## ⌨️ CLI Usage

```bash
# Basic download
node cli.js "https://youtube.com/watch?v=..."

# Download and trim a video segment
node cli.js "https://youtube.com/watch?v=..." --ss 00:00:10 --to 00:00:40

# Extract trimmed audio as MP3
node cli.js "https://youtube.com/watch?v=..." --mode audio --format mp3 -s 01:00 -e 01:30
```

---

## 📂 Project Structure

```
├── api/            # Express & Node.js backend streaming API
│   └── src/
│       ├── processing/  # Stream extraction & yt-dlp handlers
│       └── stream/      # FFmpeg stream pipeline & trimming
├── web/            # SvelteKit 5 + TypeScript static frontend
│   └── src/
│       ├── components/  # Omnibox, VideoTrimmer, Passkey, UI
│       ├── lib/         # WebAuthn, Failover API, Task Queue
│       └── routes/      # Save (Home), Remux, Settings
├── .github/        # GitHub Actions CI/CD workflows
├── cli.js          # Cross-platform CLI trimmer & downloader
└── DESIGN.md       # VoltAgent design specification
```

---

## ⚖️ Ethics & Disclaimer

Cobalt++ is a tool designed to make accessing and trimming publicly available content convenient for end users. It takes **zero liability**. The end user is responsible for the content they download, how they use it, and how they distribute it. Cobalt++ never caches downloaded content.

---

## 📄 License

Unless specified otherwise in individual subdirectories, this project is licensed under [AGPL-3.0](LICENSE).
