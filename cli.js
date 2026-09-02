#!/usr/bin/env node

import { fetch } from "undici";
import fs from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";

// Parse CLI flags
const args = process.argv.slice(2);

const printHelp = () => {
    console.log(`
\x1b[1m\x1b[36mCobalt++ CLI - Video Trimmer & Downloader\x1b[0m

\x1b[1mUsage:\x1b[0m
  node cli.js <url> [options]

\x1b[1mOptions:\x1b[0m
  --ss, -s <time>     Start timestamp (e.g. 00:00:15 or 15)
  --to, -e <time>     End timestamp (e.g. 00:01:30 or 90)
  --mode, -m <mode>   Download mode: 'auto', 'audio', or 'mute' (default: auto)
  --format, -f <fmt>  Audio format: 'mp3', 'opus', 'wav' (default: mp3)
  --api <url>         Cobalt API URL (default: http://localhost:9000)
  --output, -o <path> Output file path
  --help, -h          Show this help message

\x1b[1mExamples:\x1b[0m
  node cli.js "https://youtube.com/watch?v=..." --ss 00:10 --to 00:40
  node cli.js "https://youtube.com/watch?v=..." --mode audio -s 01:00 -e 01:30
    `);
};

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
}

let url = "";
let trimStart = undefined;
let trimEnd = undefined;
let mode = "auto";
let audioFormat = "mp3";
let apiUrl = process.env.API_URL || "http://localhost:9000";
let outputPath = "";

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--ss" || arg === "-s") {
        trimStart = args[++i];
    } else if (arg === "--to" || arg === "-e") {
        trimEnd = args[++i];
    } else if (arg === "--mode" || arg === "-m") {
        mode = args[++i];
    } else if (arg === "--format" || arg === "-f") {
        audioFormat = args[++i];
    } else if (arg === "--api") {
        apiUrl = args[++i];
    } else if (arg === "--output" || arg === "-o") {
        outputPath = args[++i];
    } else if (!arg.startsWith("-") && !url) {
        url = arg;
    }
}

if (!url) {
    console.error("\x1b[31mError: No URL provided.\x1b[0m");
    printHelp();
    process.exit(1);
}

const run = async () => {
    console.log(`\x1b[36m➜ Requesting download from Cobalt API (${apiUrl})...\x1b[0m`);
    if (trimStart || trimEnd) {
        console.log(`✂️ Trimming range: \x1b[33m${trimStart || "00:00:00"}\x1b[0m to \x1b[33m${trimEnd || "End"}\x1b[0m`);
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url,
                downloadMode: mode,
                audioFormat,
                trimStart,
                trimEnd
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();

        if (data.status === "error") {
            throw new Error(`Error: ${data.error?.code || JSON.stringify(data.error)}`);
        }

        const downloadUrl = data.url || data.audio;
        const filename = outputPath || data.filename || data.audioFilename || "download.mp4";

        if (!downloadUrl) {
            console.log("API Response:", data);
            return;
        }

        console.log(`\x1b[32m✔ Stream ready! Downloading to ${filename}...\x1b[0m`);

        const fileStream = fs.createWriteStream(filename);
        const downloadRes = await fetch(downloadUrl);

        if (!downloadRes.ok) {
            throw new Error(`Failed to stream media: ${downloadRes.statusText}`);
        }

        await pipeline(downloadRes.body, fileStream);

        console.log(`\x1b[1m\x1b[32m✔ Completed! Saved to: ${path.resolve(filename)}\x1b[0m`);
    } catch (err) {
        console.error(`\x1b[31m✖ Failed:\x1b[0m ${err.message}`);
        process.exit(1);
    }
};

run();
