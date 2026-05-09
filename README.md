# minecraft-status-checker

這是一個結合 API 服務與 Discord 機器人的 Minecraft 伺服器狀態監控工具。它可以定期檢查指定的 Minecraft 伺服器狀態，並即時將「伺服器是否在線」、「線上玩家人數」以及「玩家名單」更新到 Discord 的語音/文字頻道名稱與訊息中。

## 🌟 功能特色

- **獨立的 API 服務**：定期使用 `mcping-js` 與 Socket 檢查 Minecraft 伺服器狀態。
- **自動更新 Discord 頻道名稱**：直觀顯示 🟢 伺服器運作中 / 🔴 伺服器已離線，以及 📊 線上人數。
- **自動更新玩家名單訊息**：在指定的頻道中動態編輯最後一則訊息，列出當前在線上的玩家 ID。
- **Docker 容器化**：透過 `docker-compose` 快速部署，將 API 隱藏在內網確保安全。

## 🚀 快速開始

### 1. 系統需求
- Docker & Docker Compose
- 一個已申請好的 Discord Bot Token

### 2. 環境變數設定
請在專案根目錄下建立一個 `.env` 檔案（可參考 `.env.example`），並填入以下資訊：

```env
# Discord Bot 相關設定
BOT_TOKEN=你的_Discord_Bot_Token
GUILD_ID=你的_Discord_伺服器(Guild)_ID
CHANNEL_ID=用來顯示伺服器狀態(上線/離線)的頻道_ID
CHANNEL_ID2=用來顯示線上人數與玩家列表的頻道_ID

# API 與 Minecraft 伺服器設定
API_PORT=3019
MC_SERVER_HOST=你的_Minecraft_伺服器_IP
MC_SERVER_PORT=25565
```

### 3. 啟動服務

在專案根目錄中執行以下指令來建置並啟動背景服務：

```bash
docker-compose up -d --build
```

這會同時啟動 `api` 與 `bot` 兩個容器。你可以透過以下指令查看機器人是否成功上線：

```bash
docker-compose logs -f bot
```

## ⚠️ 注意事項
- 請確保你的 Discord 機器人擁有**管理頻道 (Manage Channels)** 與 **發送/編輯訊息 (Send/Edit Messages)** 的權限。
- 建議將設定好的 Discord 頻道權限設為「**一般成員無法發言**」，以免機器人抓取並嘗試編輯到其他玩家發送的訊息而導致報錯。
