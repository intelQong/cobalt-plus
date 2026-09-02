import { writable } from "svelte/store";
import type { CobaltDownloadButtonState } from "$lib/types/omnibox";

export const link = writable("");
export const downloadButtonState = writable<CobaltDownloadButtonState>("idle");
export const trimEnabled = writable(false);
export const trimStart = writable("00:00:00");
export const trimEnd = writable("");
