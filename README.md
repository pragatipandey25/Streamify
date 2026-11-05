<div align="center">

# 🎬 Streamify

### A High-Performance YouTube-Inspired Video Streaming Platform

Built with **React.js**, **Vite**, and the **YouTube Data API v3**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**Streamify is a full-featured, responsive video streaming application featuring mandatory Google/YouTube-style authentication, live channel subscriptions, custom video playback, interactive comments, and resilient YouTube Data API v3 integration with smart fallback caching.**

---

### 📂 Repository
**https://github.com/pragatipandey25/Streamify**

</div>

---

# ✨ Key Features

### 🎨 Modern YouTube-Inspired Branding
- Custom vector logo featuring a ruby-gradient play badge with ambient drop shadow and crisp typography.

### 🔐 Mandatory Authentication Gate
- **Pre-Access Wall**: Users must sign in before entering and exploring the streaming platform.
- **Continue with Google**: Authentic Google Account Chooser allowing users to enter their actual Google email and name, with one-tap remembered accounts.
- **Full Account Registration**: Sign up with Full Name, Email, Password, Password Confirmation, and custom channel avatar selection.
- **Session Persistence**: Authentication state, profile info, and channel subscriptions securely persist in `localStorage`.
- **Account Management**: YouTube-style user dropdown in the navbar with instant sign-out.

### 📺 Live Dynamic Channel Subscriptions
- **Zero Default Subscriptions**: The sidebar begins with **no** subscriptions.
- **Real-Time Subscription Sync**: Clicking **"Subscribe"** on any video immediately adds the creator to the user's sidebar under **Subscribed** and increments the subscriber count.
- **Unsubscribe Support**: Clicking **"Subscribed"** unsubscribes the channel and removes it dynamically from the sidebar.
- **Channel Search**: Clicking any subscribed channel in the sidebar filters that creator's videos.

### 🎬 Interactive Video Experience
- **Embedded Player**: Full-featured responsive 16:9 YouTube video embed with autoplay and controls.
- **Like & Dislike**: Real-time counter toggling with active visual states.
- **Share**: One-click video URL copy to clipboard with instant toast notifications.
- **Save to Watch Later**: Toggle video saved state with toast confirmation.
- **Expandable Description**: Clean "Show more" / "Show less" toggle for detailed video descriptions.
- **Interactive Comments**: Users can type and post comments that immediately appear in the discussion thread with their personalized avatar and timestamp.
- **Recommended Videos**: Dynamic "Up next" sidebar featuring related content and smooth navigation.

### 🔍 Discovery & Navigation
- **Instant Search**: Search through thousands of YouTube videos by title, creator, or topic.
- **🎙 Voice Search**: Integrated Web Speech API for voice search directly from the search bar.
- **Category Filter**: Browse trending content across Gaming, Music, Sports, Technology, Automobiles, Entertainment, News, and Blogs.
- **Play Any Video**: Custom modal allowing users to paste any external YouTube URL or Video ID to watch it instantly.
- **Responsive Sidebar**: Collapsible desktop sidebar and mobile-friendly drawer navigation.
- **Animated Skeletons**: Smooth pulse placeholder cards during content loading.

### 📡 Smart API Resilience & Fallback Cache
- Designed to gracefully handle YouTube Data API v3 daily quota limits (10,000 units/day).
- If the API quota is reached or network is unavailable, Streamify seamlessly switches to curated sample showcases across all categories, ensuring **the app never shows a broken or empty screen**.

---

# 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18.3 |
| **Bundler & Build Tool** | Vite 6.0 |
| **Routing** | React Router DOM v7 |
| **State Management** | React Context API (`AuthContext`) |
| **Date & Time Formatting** | Moment.js |
| **Styling** | Pure CSS3 (Flexbox, Grid, CSS Variables, Animations) |
| **API** | YouTube Data API v3 |
| **Code Quality** | ESLint 9 (Flat Config) |

---

# 📂 Project Structure

```text
Streamify/
│
├── public/
│   ├── faviconn.png
│   └── site.webmanifest
│
├── src/
│   ├── assets/                      # Icons, thumbnails, and avatar assets
│   │
│   ├── Components/
│   │   ├── Feed/                    # Video grid, cards, and skeleton loaders
│   │   ├── Logo/                    # Vector Streamify brand logo
│   │   ├── Navbar/                  # Header, search, voice search, modals, user menu
│   │   ├── PlayVideo/               # Player, actions, channel info, comments form
│   │   ├── Recommended/             # Related sidebar videos
│   │   └── Sidebar/                 # Navigation categories & dynamic subscriptions
│   │
│   ├── context/
│   │   ├── AuthContext.jsx          # Auth provider, login, signup, subscriptions
│   │   ├── AuthContextInstance.js   # React Context instance
│   │   ├── authConstants.js         # Avatar options and auth constants
│   │   └── useAuth.js               # Custom auth hook
│   │
│   ├── Pages/
│   │   ├── Home/                    # Main feed and category view
│   │   ├── Login/                   # Google OAuth dialog, Sign In & Sign Up
│   │   ├── Search/                  # Search results page
│   │   └── Video/                   # Video watch view
│   │
│   ├── App.jsx                      # App root with auth guard and routes
│   ├── data.js                      # API helpers, value converter, and fallback engine
│   ├── mockData.js                  # Comprehensive offline fallback showcase
│   ├── main.jsx                     # Vite entry point
│   └── index.css                    # Global design tokens and reset styles
│
├── .env                             # YouTube API Key configuration
├── eslint.config.js                 # Modern ESLint configuration
├── package.json                     # Scripts and dependencies
├── vite.config.js                   # Vite configuration
└── README.md
```

---

# 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/pragatipandey25/Streamify.git
cd Streamify
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure the YouTube API Key
Create a `.env` file in the root directory (or use the preconfigured one):
```env
VITE_YOUTUBE_API_KEY=YOUR_YOUTUBE_DATA_API_KEY
VITE_API_KEY=YOUR_YOUTUBE_DATA_API_KEY
```

> **Note**: Even without a personal API key or when YouTube API quota limits are reached, Streamify automatically falls back to curated sample content so you can explore and test all features offline.

### 4. Run the development server
```bash
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

# 🔑 Google Cloud YouTube API Setup

To use your own YouTube Data API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `Streamify`).
3. Navigate to **APIs & Services > Library** and enable **YouTube Data API v3**.
4. Navigate to **APIs & Services > Credentials** and click **Create Credentials > API Key**.
5. Copy your API Key and paste it into `.env`:
   ```env
   VITE_YOUTUBE_API_KEY=AIzaSy...
   ```

---

# 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite dev server with hot module replacement (HMR) |
| `npm run build` | Compiles optimized production bundle into `dist/` |
| `npm run preview` | Locally previews the production build |
| `npm run lint` | Runs ESLint to verify code quality and consistency |

---

# 📱 Responsive Design

Streamify is engineered for all viewport sizes:
- 💻 **Desktop / Widescreen**: Multi-column video grid, fixed sidebar, side-by-side video & recommendations.
- 💼 **Laptop / Tablet Landscape**: Collapsible icon-only mini sidebar.
- 📱 **Tablet Portrait & Mobile**: Full-width feeds, drawer navigation, stacked video view, and touch-optimized action buttons.

---

# 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the project.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "Add AmazingFeature"`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

# 👩‍💻 Author

**Pragati Pandey**
- GitHub: [@pragatipandey25](https://github.com/pragatipandey25)
- Repository: [Streamify](https://github.com/pragatipandey25/Streamify)

<div align="center">

⭐ **If you enjoy Streamify, consider starring the repository!**

</div>
