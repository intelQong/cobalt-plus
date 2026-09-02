import { spawn } from "child_process";
import { env } from "../../config.js";
import sanitize from "sanitize-filename";

/**
 * Execute yt-dlp CLI command and parse JSON output
 * @param {string[]} args
 * @returns {Promise<any>}
 */
const runYtDlp = (args) => {
    return new Promise((resolve, reject) => {
        const bin = env.ytdlpPath || "yt-dlp";
        const proc = spawn(bin, args, { windowsHide: true });

        let stdout = "";
        let stderr = "";

        proc.stdout.on("data", (data) => {
            stdout += data.toString();
        });

        proc.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        proc.on("close", (code) => {
            if (code === 0) {
                try {
                    const parsed = JSON.parse(stdout);
                    resolve(parsed);
                } catch (e) {
                    resolve({ raw: stdout });
                }
            } else {
                reject(new Error(stderr || `yt-dlp exited with code ${code}`));
            }
        });

        proc.on("error", (err) => {
            reject(err);
        });
    });
};

/**
 * Service handler for yt-dlp
 */
export default async function ({
    url,
    quality = "1080",
    isAudioOnly = false,
    isAudioMuted = false,
    trimStart,
    trimEnd,
    audioFormat = "mp3"
}) {
    try {
        const targetUrl = typeof url === "string" ? url : url.href;

        const args = [
            "--dump-json",
            "--no-playlist",
            "--no-warnings",
            targetUrl
        ];

        const info = await runYtDlp(args);

        if (!info || !info.title) {
            return { error: "fetch.fail" };
        }

        const title = sanitize(info.title || "video").trim();
        const duration = info.duration || 0;

        // Check if duration exceeds limit if configured
        if (env.durationLimit && duration > env.durationLimit) {
            return { error: "content.too_long" };
        }

        // Format selection
        if (isAudioOnly) {
            // Find best audio stream
            const audioStream = info.url || (info.formats && info.formats.find(f => f.vcodec === 'none' && f.url)?.url);

            return {
                type: "audio",
                service: "ytdlp",
                url: audioStream || info.url,
                filename: `${title}.${audioFormat}`,
                audioFormat,
                isAudioOnly: true,
                trimStart,
                trimEnd
            };
        }

        if (isAudioMuted) {
            return {
                type: "mute",
                service: "ytdlp",
                url: info.url,
                filename: `${title}.mp4`,
                trimStart,
                trimEnd
            };
        }

        // If direct combined stream is available
        if (info.url) {
            return {
                type: "redirect",
                service: "ytdlp",
                url: info.url,
                filename: `${title}.${info.ext || "mp4"}`,
                trimStart,
                trimEnd
            };
        }

        // Return best video stream
        const bestFormat = info.formats?.find(f => f.url && f.vcodec !== 'none') || info.formats?.[0];

        return {
            type: "redirect",
            service: "ytdlp",
            url: bestFormat?.url || targetUrl,
            filename: `${title}.${info.ext || "mp4"}`,
            trimStart,
            trimEnd
        };
    } catch (e) {
        console.error("yt-dlp extraction error:", e);
        return { error: "fetch.fail" };
    }
}
