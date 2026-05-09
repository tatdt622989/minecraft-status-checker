const express = require('express');
const net = require('net');
const mcping = require("mcping-js");
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 3019; // API 監聽的埠
const MC_SERVER_HOST = process.env.MC_SERVER_HOST; // 透過環境變數取得伺服器 IP
const MC_SERVER_PORT = parseInt(process.env.MC_SERVER_PORT, 10) || 25565; // 確保 Port 為數字

// 檢查伺服器是否在線
function checkServerStatus() {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        socket.setTimeout(3000); // 設定超時為3秒

        socket.connect(MC_SERVER_PORT, MC_SERVER_HOST, () => {
            socket.destroy(); // 成功連接後關閉
            resolve(true); // 線上
        });

        socket.on('error', () => resolve(false)); // 發生錯誤，視為離線
        socket.on('timeout', () => resolve(false)); // 超時，視為離線
    });
}


app.get('/status', async (req, res) => {
    const isOnline = await checkServerStatus();
    res.json({ online: isOnline }); // 返回 JSON 格式
});

// API 路由：取得 Minecraft 伺服器當前人數
app.get("/server-status", (req, res) => {
    const serverIp = MC_SERVER_HOST;
    const serverPort = MC_SERVER_PORT; // 默認 Minecraft port

    if (!serverIp) {
        return res.status(400).json({ error: "缺少伺服器 IP 地址" });
    }

    // 使用 mcping-js
    const server = new mcping.MinecraftServer(serverIp, serverPort);

    server.ping(1000, 47, (err, response) => {
        if (err) {
            return res.status(500).json({ error: "無法連接到伺服器", details: err.message });
        }

        res.json({
            onlinePlayers: response.players.online,
            maxPlayers: response.players.max,
            motd: response.description.text || "", // Server Message of the Day
            version: {
                name: response.version.name,
                protocol: response.version.protocol,
            },
            players: response.players.sample || [], // 在線玩家樣本
        });
    });
});


// 啟動伺服器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`API 啟動成功：http://0.0.0.0:${PORT}/status`);
});
