# ☁️ MZ-CLOUD — Telegram CDN Cloud Storage Platform
### *Production-Ready Personal Cloud Storage Built on Telegram CDN & Saved Messages*

[![Node.js](https://img.shields.io/badge/Node.js-v20%20LTS-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://react.dev/)
[![Telegram CDN](https://img.shields.io/badge/Storage-Telegram%20CDN%20Only-0088cc.svg)](https://telegram.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏛️ Architecture & Core Philosophy: Zero Server Storage & Strict Data Isolation
Unlike traditional storage platforms that require massive server hard drive arrays, **MZ-CLOUD** leverages **Telegram's secure CDN** as its data layer.

- **Never Save Files to Server Disk:** All Photos, Videos, Audio tracks, Voice notes, Documents, Archives, and Code files stay 100% inside Telegram servers.
- **Strict Multi-Tenant Data Isolation:** Every database query strictly filters by `userId` or `user.telegramId`. No user can ever view, search, or access another user's files or folders.
- **What Our Server Stores:**
  - Telegram `fileId` and `uniqueFileId` references.
  - User-defined nested folder hierarchy.
  - Private Markdown notes and checkable task lists.
  - Colored tags (`#photo`, `#work`, `#uzbekistan`).
  - Full-Text Search (FTS) vector index.
- **Telegram Bot API Size Limits Enforced:**
  - 🖼️ **Photos / Images:** Maximum **10 MB** per image.
  - 🎬 **Videos / Audio / Documents / Archives:** Maximum **50 MB** per item (enforces Telegram Bot upload constraints).

---

## 🚀 Key Features

### 1. 👥 Telegram WebApp Exclusive Access & Live Avatar
- **Exclusive Telegram App Access:** Cannot be opened in external web browsers. Enforces `window.Telegram.WebApp` verification.
- **Live User Profile Avatar:** Displays the user's current Telegram profile photo (`user.profilePhoto` / `photo_url`) in the dashboard header.
- Automatically assigns `SUPER_ADMIN` role to the user matching `ADMIN_TELEGRAM_ID`.

### 2. 🔍 Telegram Inline Search Mode (`@MZCloudBot <query>`)
- Users can type `@MZCloudBot <query>` inside **any Telegram chat, group, or channel** to instantly search all of their personal cloud files and send an interactive file card to their friends!

### 3. 📱 100% Mobile Responsive & Feather Vector Icons (`react-icons/fi`)
- Built with crisp **Feather Icons (`react-icons/fi`)** across the entire UI (no unicode text emojis in frontend).
- **Glassmorphism Telegram Desktop Design:** Sleek `#1e2329/90` translucent cards with Telegram Blue `#2481cc` accents and smooth micro-animations.
- **Mobile Drawer Navigation:** Responsive slide-over hamburger drawer for mobile devices and resizable sidebar for desktop screens.

### 4. 🤖 Super-Fast Telegram Bot with i18n & All Interactive Menus
- **Lightning-Fast Execution:** Non-blocking async handlers and immediate callback query responses (`answerCbQuery`).
- **Interactive Buttons:** `[📝 Note]` and `[🏷️ Tags]` buttons allow replying with text or selecting tags directly in Telegram.
- **Full Bot i18n:** Automatically responds in **Uzbek (`uz`)**, **English (`en`)**, or **Russian (`ru`)** based on user language via `/lang` or language switcher menu.
- **Every Menu Works:** Every single menu includes an interactive **"🔙 Go Back (`back_to_main`)"** button.

### 5. 🖼️ Live Telegram CDN Photo Streaming & File Download
- **Real Photo Thumbnails:** Displays actual Telegram CDN photo thumbnails in the WebApp gallery via `/api/v1/files/:id/thumbnail`.
- **Original CDN Download / Stream:** Stream or download any original file (Photo, Video, PDF, Audio, Code) directly from Telegram CDN via `/api/v1/files/:id/download`.

### 6. 📂 Enterprise Folder & Tag System
- **Nested Folders:** Unlimited multi-level tree hierarchy with vector icons and custom hex colors.
- **Smart Folders:** Dynamic folders filtering automatically by category (`PHOTO`, `VIDEO`, `FAVORITE`).
- **Colored Tags:** Manage tag badges for instant filtering.

### 7. 🛡️ Super Admin Panel (`/admin`)
- Accessible via `/admin` in the WebApp or the **"🛡️ Super Admin Panel"** button in the bot (for authorized admins only).
- Non-admin users are blocked with an explicit **Admin Authorization Required** screen.
- Realtime system monitoring (Redis cache status, PostgreSQL DB latency, active worker queue length, RAM usage, CPU load).
- User Management table with Ban / Unban controls and ban reason logging.
- Audit Log stream tracking security events.
- **Broadcast Announcement Tool:** Send messages to all active bot users.

---

## 🛠️ Project Structure (Clean Server & Client Architecture)

```text
/home/user/
├── backend/
│   ├── config/             # Database (Prisma), Redis (with in-memory fallback), Pino Logger, App Config
│   ├── constants/          # Media categories, Telegram 10MB/50MB size limits, Events, Error Codes
│   ├── controllers/        # REST controllers (Auth, File, Folder, Search, Admin, Share)
│   ├── cron/               # Scheduled daily Recycle Bin purge (>30 days)
│   ├── middlewares/        # JWT + Telegram HMAC Auth, RBAC, Rate Limiting, Security, Errors
│   ├── prisma/             # Schema & Seed script (0 demo files; only Super Admin)
│   ├── queues/             # Parallel upload processing worker pool
│   ├── repositories/       # Prisma data access layer with strict userId/telegramId isolation
│   ├── routes/             # OpenAPI documented versioned router (/api/v1) + Swagger UI (/docs)
│   ├── services/           # Core business logic (Auth, File, Search, Folder, Statistics)
│   ├── socket/             # Realtime Socket.IO server
│   ├── telegram/
│   │   ├── commands/       # /start, /help, /stats, /lang commands
│   │   ├── handlers/       # Non-blocking media, text reply, inline search (@MZCloudBot), & callback handlers
│   │   ├── i18n/           # Localized bot messages (uz, en, ru)
│   │   └── utils/          # Standard Telegram symbol formatting
│   └── validators/         # Zod schemas with Telegram size limit enforcement
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/      # Super Admin Panel
│   │   │   ├── layout/     # Header (user profile photo avatar), Sidebar (drawer/resizable), AudioBar
│   │   │   ├── media/      # FileGrid, FileCard, ContextMenu, Gallery/Video/Code Modals
│   │   │   └── modals/     # SearchModal, NoteEditorModal, TagEditorModal, FolderModal, ShareModal
│   │   ├── hooks/          # TanStack Query custom hooks
│   │   ├── i18n/           # English, Russian, Uzbek dictionaries
│   │   ├── pages/          # DashboardPage, AdminPage (/admin), SharedFilePage (/share/:token)
│   │   ├── services/       # Axios API client & Socket.IO client
│   │   └── store/          # Zustand stores (Auth, UI, AudioPlayer, UploadQueue)
│   └── vite.config.js
├── ecosystem.config.js     # PM2 Cluster manager configuration
└── package.json            # Root scripts
```

---

## ⚡ Quickstart Guide

1. **Install Dependencies & Seed Database:**
   ```bash
   npm run postinstall
   npm run db:push
   node backend/prisma/seed.js
   ```

2. **Start MZ-CLOUD Backend & Frontend Development Server Concurrently:**
   ```bash
   npm run dev
   ```

3. **Access the Platform:**
   - **Web Application (inside Telegram):** `http://localhost:5173`
   - **OpenAPI Swagger Docs:** `http://localhost:5000/api/v1/docs`
   - **Super Admin Account:** Automatically logged in via Telegram ID `777000`.

---

## 🌐 Vercel & Render Integration
- **Frontend URL:** `https://mz-cloud.vercel.app`
- **Backend URL:** `https://mz-cloud.onrender.com`
- `client/src/services/api.js` and `socket.js` automatically route API and WebSocket traffic to `https://mz-cloud.onrender.com/api/v1` when running on `vercel.app`.
