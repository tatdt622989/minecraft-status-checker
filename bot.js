require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;
const CHANNEL_ID2 = process.env.CHANNEL_ID2;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3019';
const API_URL = `${API_BASE_URL}/status`;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 當 Bot 準備好時
client.once('ready', () => {
    console.log(`${client.user.tag} 已上線！`);
    updateChannelName(); // 啟動時檢查一次
    setInterval(updateChannelName, 3 * 60 * 1000); // 每3分鐘更新一次
});

const serverIsOnline = async () => {
    console.log('正在檢查伺服器狀態...');
    try {
        const response = await axios.get(API_URL);
        const isOnline = response.data.online;
        console.log(`伺服器目前${isOnline ? '在線' : '離線'}`);

        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(CHANNEL_ID);
        console.log(`伺服器名稱: ${guild.name}`);
        console.log(`頻道名稱: ${channel.name}`);

        const newName = isOnline ? '🟢伺服器運作中' : '🔴伺服器已離線';
        await channel.setName(newName);
        console.log(`頻道名稱已更新為: ${newName}`);
    } catch (error) {
        console.error('更新頻道名稱失敗:', error.message);
    }
}

const serverStatus = async () => {
    console.log('正在檢查伺服器狀態...');
    try {
        const response = await axios.get(`${API_BASE_URL}/server-status`);
        const { onlinePlayers, maxPlayers, motd, version } = response.data;
        console.log(`伺服器當前人數: ${onlinePlayers}/${maxPlayers}`);
        const guild = await client.guilds.fetch(GUILD_ID);
        const channel = await guild.channels.fetch(CHANNEL_ID2);
        const newName = `📊線上人數：${onlinePlayers || 0}`
        await channel.setName(newName);
        console.log(`頻道名稱已更新為: ${newName}`);

        if (!onlinePlayers && onlinePlayers !== 0) {
            return;
        }
        // 修改最後一則訊息，顯示伺服器訊息
        const messages = await channel.messages.fetch({ limit: 1 });
        const lastMessage = messages.first();
        console.log(`伺服器名稱: ${guild.name}`);
        console.log(`伺服器版本: ${version.name} (協議: ${version.protocol})`);
        console.log(`伺服器訊息: ${motd}`);
        let str = `# 誰在線上 ? (每5分鐘更新一次)\n`;
        const players = response.data.players.map((player, index) => `- ${player.name} `).join('\n');
        str += players;
        if (lastMessage) {
            await lastMessage.edit(str);
        } else {
            // 找不到最後一則訊息，新增一則
            await channel.send(str);
        }
    } catch (error) {
        console.error('更新頻道名稱失敗:', error.message);
    }
}

// 更新頻道名稱
async function updateChannelName() {
    await serverIsOnline();
    await serverStatus();
}

// 登入 Bot
client.login(BOT_TOKEN);
