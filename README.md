# SparkBoard

AI 商業點子雷達 — 自動從 Reddit / X / Facebook 蒐集熱門貼文，透過 AI 評分與分析，視覺化呈現最具潛力的商業機會。

## Architecture

```
Reddit / X / Facebook
        │
        ▼
   n8n Workflow        ← 定時爬取 + AI 評分
        │
        ▼
   Google Sheets       ← 結構化資料儲存
        │
        ▼
   Next.js Dashboard   ← 視覺化呈現
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui |
| Charts | Recharts |
| Data Fetching | SWR + Google Sheets API (read-only) |
| Automation | n8n (self-hosted) |
| AI Models | Gemini (via OpenRouter) |
| Data Store | Google Sheets |

## Features

- **排行榜** — 表格 / 卡片雙視圖，支援多維度排序
- **多來源支援** — Reddit、X (Twitter)、Facebook 資料整合
- **AI 五維評分** — 可行性、商業性、新穎性、社群吸引力、台灣市場適用性
- **篩選與搜尋** — 依來源、標籤、分數、日期、關鍵字篩選
- **圖表分析** — 雷達圖、趨勢圖、分數分佈、標籤統計
- **每日 / 每週摘要** — 自動彙整 Top N 點子
- **Hover 預覽** — 滑鼠懸停即可快速瀏覽完整分析

## Data Pipeline (n8n)

完整的 n8n workflow 匯出檔在 [`n8n/reddit-crawler-workflow.json`](./n8n/reddit-crawler-workflow.json)。

### Workflow 流程

```
Schedule Trigger (一、三、五、日 07:00)
    │
    ├─→ Get Dataset (讀取現有資料，取得已存在的 URL 避免重複)
    │
    ├─→ Reddit Search (創業類)      ← SideProject, Business_Ideas, IndieHackers...
    ├─→ Reddit Search (AI 類)       ← AI_Agents, AIautomation, PromptEngineering...
    ├─→ Reddit Search (Builder 類)  ← SaaS, buildinpublic, microsaas...
    │
    ▼
Merge + Deduplicate + Filter
    │  (10天內 + score+comments > 80 + Top 40)
    ▼
AI Content Classifier (Gemini)
    │  判斷是否與「AI 商業應用」相關
    ▼
AI Scoring Agent (Gemini)
    │  五維評分 + 摘要 + 商業分析 + 社群發文建議 + 分類標籤
    ▼
Filter High Potential (總分 >= 70)
    │
    ▼
Save to Google Sheets
```

### 監控的 Subreddits

| 分類 | Subreddits |
|------|-----------|
| 創業類 | SideProject, Business_Ideas, ProductManagement, solopreneurs, IndieHackers, NoCode, Passive_Income |
| AI 類 | AI_Agents, AIautomation, ChatGPTCoding, PromptEngineering, LocalLLaMA |
| Builder 類 | SaaS, buildinpublic, microsaas, Automate, n8n |

### AI 評分標準（總分 100）

| 維度 | 權重 | 說明 |
|------|------|------|
| 精實可行性 | ×2.0 | 1-2 名工程師、一個月內 MVP、低資本支出 |
| 商業變現力 | ×2.0 | 商業模式清晰、客戶付費意願高 |
| 創新差異化 | ×1.5 | 獨特切入點、藍海市場潛力 |
| 社群吸引力 | ×1.5 | 話題性、社群傳播潛力 |
| 台灣市場適用性 | ×3.0 | 解決台灣特定族群痛點（缺工、數位化低等） |

### 如何使用 n8n Workflow

1. 在 n8n 中匯入 `n8n/reddit-crawler-workflow.json`
2. 設定以下 Credentials：
   - **Reddit OAuth2** — 需要 Reddit API app ([建立方式](https://www.reddit.com/prefs/apps))
   - **OpenRouter API** — 取得 API Key ([openrouter.ai](https://openrouter.ai))
   - **Google Sheets OAuth2** — 連接你的 Google 帳號
3. 在 Google Sheets 節點中替換為你自己的 Spreadsheet ID
4. 啟動 Workflow

## Google Sheets 欄位結構

| Column | 欄位 | 說明 |
|--------|------|------|
| A | 日期 | 貼文發布時間 |
| B | 標題 | 原始英文標題 |
| C | 中文標題 | AI 翻譯的中文標題 |
| D | 留言數 | 原始貼文留言數 |
| E | 按讚數 | 原始貼文按讚數 |
| F | 可行性 | AI 評分 (1-10) |
| G | 商業性 | AI 評分 (1-10) |
| H | 新穎性 | AI 評分 (1-10) |
| I | 社群吸引力 | AI 評分 (1-10) |
| J | 台灣市場適用性 | AI 評分 (1-10) |
| K | 總分 | 加權總分 (最高 100) |
| L | 重點整理 | AI 生成的 3-5 句摘要 |
| M | 商業機會分析 | AI 生成的 200-300 字分析 |
| N | Threads 切入角度 | AI 生成的社群發文建議 |
| O | 原始 URL | 貼文原始連結 |
| P | Reddit 連結 | Reddit permalink |
| Q | X 連結 | X/Twitter 連結 |
| R | FB 連結 | Facebook 連結 |
| S | Subreddit | 來源 Subreddit |
| T | 類別 | AI 分類標籤 (JSON array) |
| U | 來源 | 資料來源 (reddit/x/facebook) |

## Getting Started

### Prerequisites

- Node.js 18+
- Google Sheets API Key

### Setup

```bash
# Clone
git clone https://github.com/tommyhuangtw/SparkBoard.git
cd SparkBoard

# Install dependencies
npm install

# Set environment variable
cp .env.example .env
# Edit .env and add your Google Sheets API Key

# Run dev server
npm run dev
```

### Environment Variables

```env
TOMMYHUANG0511_GOOGLE_SHEET_API=your_google_sheets_api_key
```

> Google Sheets API Key 僅需要**唯讀**權限，用於前端讀取資料。寫入資料由 n8n 透過 OAuth2 處理。

## Deploy

推薦使用 [Vercel](https://vercel.com) 部署：

1. Import GitHub repo
2. 在 Environment Variables 中加入 `TOMMYHUANG0511_GOOGLE_SHEET_API`
3. Deploy

## License

MIT
