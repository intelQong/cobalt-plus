import { app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fork } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mainWindow = null;
let apiProcess = null;
const API_PORT = process.env.API_PORT || 9000;
const SERVER_URL = `http://localhost:${API_PORT}`;

function startBackend() {
    const apiPath = path.resolve(__dirname, "../api/src/cobalt.js");
    
    apiProcess = fork(apiPath, [], {
        env: {
            ...process.env,
            API_PORT: API_PORT.toString(),
            WEB_STATIC_PATH: path.resolve(__dirname, "../web/build"),
            ENABLE_YTDLP: "1"
        },
        silent: false
    });

    apiProcess.on("error", (err) => {
        console.error("Failed to start backend server:", err);
    });
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1020,
        height: 760,
        minWidth: 480,
        minHeight: 600,
        backgroundColor: "#08080c",
        title: "Cobalt++",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true
        }
    });

    // Open external links in default system browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (!url.startsWith(SERVER_URL)) {
            shell.openExternal(url);
            return { action: "deny" };
        }
        return { action: "allow" };
    });

    const loadApp = () => {
        mainWindow.loadURL(SERVER_URL).catch(() => {
            setTimeout(loadApp, 500);
        });
    };

    loadApp();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    startBackend();
    setTimeout(createWindow, 600);

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => {
    if (apiProcess) {
        apiProcess.kill("SIGTERM");
    }
});
