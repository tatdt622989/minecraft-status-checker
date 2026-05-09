FROM node:18-alpine

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 以利用 Docker 快取機制安裝依賴
COPY package*.json ./
RUN npm install

# 複製專案原始碼
COPY . .

# CMD 將會在 docker-compose.yml 裡面針對不同服務覆蓋