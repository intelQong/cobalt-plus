<div align="center">
  <br />
  <p>
    <img src="web/static/favicon.png" title="Cobalt++" alt="Cobalt++ logo" width="100" />
  </p>
  <h1>cobalt++</h1>
  <p>
    <strong>The ultimate media downloader and video trimmer — fast, privacy-focused, and ad-free.</strong>
  </p>

  <p>
    <a href="https://github.com/intelQong/cobalt/actions/workflows/test.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/intelQong/cobalt/test.yml?style=flat-square&label=Build%20%26%20Tests" alt="Build Status" />
    </a>
    <img src="https://img.shields.io/badge/version-11.7.1-8b5cf6?style=flat-square" alt="Version" />
    <img src="https://img.shields.io/badge/platforms-Web%20%7C%20Docker%20%7C%20CLI-06b6d4?style=flat-square" alt="Platforms" />
    <img src="https://img.shields.io/badge/license-AGPL--3.0-emerald?style=flat-square" alt="License" />
  </p>
  <br />
</div>

---

## ⚡ What is Cobalt++?

**Cobalt++** is an enhanced, high-performance edition of Cobalt designed to save, remux, and trim media from YouTube, Twitter/X, TikTok, Instagram, Reddit, and dozens of other platforms without ads, trackers, paywalls, or bloat.

Paste the link, adjust your trim timestamps, download, and move on.

---

## ✨ Features & Enhancements

### 🎨 Modern Void UI Redesign (`awesome-design-md`)
- Conforms to the [VoltAgent awesome-design-md](https://github.com/voltagent/awesome-design-md) design specification ([DESIGN.md](DESIGN.md)).
- **Obsidian Dark Canvas (`#08080c`)** with soft ambient radial violet luminescence.
- **Glassmorphic Cards** with translucent frosted borders and 24px glowing focus rings.
- **Keyboard Shortcuts:** `⌘V` (Paste), `T` (Toggle Trimmer), `↵` (Save/Download).
- **Instant Search:** Real-time filter drawer for supported services.

### ✂️ Interactive Video Trimming
- **Dual Time Inputs:** Set custom start and end timestamps (`00:00:15` to `00:00:45`).
- **Live Duration Calculation:** Instant badge showing total trimmed duration.
- **Quick Preset Pills:** `15s`, `30s`, `60s`, or `Full Video` with a single click.
- **Client & Server Trimming:** In-browser WebAssembly trimming via `libav.js` and server-side FFmpeg `-ss`/`-to` stream processing.
- **Local File Trimming:** Built directly into the in-browser Remux tool (`/remux`).

### 🚀 `yt-dlp` Extractor & Fallback Engine
- Integrated `yt-dlp` engine for stream extraction, high-res audio/video formats, and partial section downloading (`--download-sections`).
- Fully compliant with GitHub Terms of Service and open-source licensing.

### 💻 Standalone Portable Desktop App
- Packaged with Electron for zero-install portability:
  - 🐧 **Linux:** Single `.AppImage` (runs across Ubuntu, Fedora, Debian, Arch).
  - 🪟 **Windows:** Single Portable `.exe` (no installer needed, runs from USB).
- Multi-platform automated builds powered by **GitHub Actions** ([`.github/workflows/build-desktop.yml`](.github/workflows/build-desktop.yml)).

### ⌨️ Terminal Trimming CLI (`cli.js`)
- Save and trim media directly from your command line:
  ```bash
  node cli.js "https://youtube.com/watch?v=..." --ss 00:15 --to 00:45
  ```

---

## 🚀 Quick Start

### 1. Web & Development Setup

```bash
# Clone the repository
git clone https://github.com/intelQong/cobalt.git
cd cobalt

# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

### 2. Terminal CLI Usage

```bash
# Basic download
node cli.js "https://youtube.com/watch?v=..."

# Download trimmed section
node cli.js "https://youtube.com/watch?v=..." --ss 00:00:10 --to 00:00:40

# Extract trimmed audio as MP3
node cli.js "https://youtube.com/watch?v=..." --mode audio --format mp3 -s 01:00 -e 01:30
```

---

## ☁️ Cloudflare Pages Hosting (100% Free)

You can host the Cobalt++ frontend on Cloudflare Pages for free with zero maintenance:

### Option A: Connect directly via Cloudflare Dashboard (Recommended)
1. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. Select repository: `intelQong/cobalt-plus`.
3. Set the build configuration:
   - **Framework preset:** `None`
   - **Build command:** `pnpm --filter @imput/cobalt-web build`
   - **Build output directory:** `web/build`
   - **Root directory:** `/`
4. Add Environment Variables under **Settings** > **Environment variables**:
   - `WEB_DEFAULT_API` = `https://api.yourdomain.com` *(your backend API URL or public instance)*
   - `NODE_VERSION` = `20`
5. Click **Save and Deploy**. Your site will be live instantly with a free `*.pages.dev` domain and global CDN!

### Option B: Automated Deploy via GitHub Actions
Add your Cloudflare credentials in GitHub repository secrets:
- `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages edit permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID.

Every push to `main` will build and deploy automatically via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

---

## 🐳 Docker Deployment (Backend & Full-Stack)

```bash
docker run -d \
  --name cobalt-plus-plus \
  --restart unless-stopped \
  -p 9000:9000 \
  -e API_URL="https://api.yourdomain.com" \
  -e ENABLE_YTDLP=1 \
  ghcr.io/imputnet/cobalt:11
```

---

## 📂 Project Structure

```
├── api/            # Express & Node.js backend streaming API
│   └── src/
│       ├── processing/  # Service handlers & yt-dlp extractor
│       └── stream/      # FFmpeg stream pipeline & trimming
├── web/            # SvelteKit 5 + TypeScript frontend application
│   └── src/
│       ├── components/  # Omnibox, VideoTrimmer, Services
│       └── routes/      # Main landing page & Remux tool
├── .github/        # GitHub Actions CI/CD workflows
├── cli.js          # Terminal CLI video trimmer & downloader
└── DESIGN.md       # VoltAgent awesome-design-md specification
```

---

## ⚖️ Ethics & Disclaimer

Cobalt++ is a tool designed to make accessing and trimming publicly available content convenient for end users. It takes **zero liability**. The end user is responsible for the content they download, how they use it, and how they distribute it. Cobalt++ never caches downloaded content.

---

## 📄 License

Unless specified otherwise in individual subdirectories, this project is licensed under [AGPL-3.0](LICENSE).
