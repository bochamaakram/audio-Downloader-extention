# 🎵 YouTube Audio Downloader

A sleek Chrome extension that allows you to download MP3 audio from YouTube videos with a single click.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## ✨ Features

- **One-Click Download** – Download MP3 audio directly from any YouTube video
- **Seamless Integration** – Download button appears right below the video player
- **Beautiful UI** – Modern, dark-themed interface with smooth animations
- **Toast Notifications** – Real-time status updates during conversion
- **Modal Download** – Clean download modal when your MP3 is ready
- **SPA Support** – Works seamlessly with YouTube's single-page navigation

## 📸 Preview

The extension adds a "Download MP3" button directly into YouTube's video action buttons, making it easy to download audio without leaving the page.

## 🚀 Installation

### From Source (Developer Mode)

1. **Clone or download** this repository:
   ```bash
   git clone https://github.com/bochamaakram/audio-Downloader-extention.git
   ```

2. **Open Chrome** and navigate to:
   ```
   chrome://extensions/
   ```

3. **Enable Developer Mode** (toggle in the top-right corner)

4. **Click "Load unpacked"** and select the extension folder

5. **Done!** The extension icon will appear in your Chrome toolbar

### Alternative: Tampermonkey Script

If you prefer using Tampermonkey, a userscript version is available in the `tampermonkey/` folder:

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/)
2. Open `tampermonkey/youtube-audio-downloader.user.js`
3. Click "Install" in Tampermonkey

## 📖 How to Use

1. Navigate to any **YouTube video** page
2. Look for the **"Download MP3"** button below the video player (next to Like, Share, etc.)
3. **Click the button** – the extension will start converting the video
4. Wait for the **conversion** to complete (you'll see a processing notification)
5. When ready, a **modal popup** will appear with the download link
6. Click **"Download MP3"** to save your file

## 📁 Project Structure

```
chrome-extension/
├── manifest.json        # Extension configuration (Manifest V3)
├── content.js           # Main script injected into YouTube pages
├── background.js        # Service worker for background tasks
├── popup.html           # Extension popup UI
├── popup.js             # Popup functionality
├── styles.css           # Styles for injected UI elements
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── tampermonkey/        # Alternative Tampermonkey script
│   └── youtube-audio-downloader.user.js
└── README.md
```

## 🔧 Technical Details

| Specification | Details |
|--------------|---------|
| **Manifest Version** | V3 |
| **Permissions** | `activeTab` |
| **Host Permissions** | `youtube.com`, `youtube-mp36.p.rapidapi.com` |
| **Content Scripts** | Injected on YouTube video pages |
| **API** | YouTube MP3 converter via RapidAPI |

### Key Components

- **Content Script** (`content.js`): Handles video detection, button injection, and download logic
- **Service Worker** (`background.js`): Manages background tasks and extension lifecycle
- **Popup** (`popup.html`/`popup.js`): Provides instructions and extension status
- **Styles** (`styles.css`): Custom CSS for the download button, toast notifications, and modal

## ⚙️ API Configuration

The extension uses the [YouTube MP3 API](https://rapidapi.com/ytjar/api/youtube-mp36) from RapidAPI. The API key is embedded in the extension for convenience.

> **Note**: For production use, consider implementing a backend proxy to secure your API key.

## 🎨 Theme

The extension features a **Catppuccin Mocha**-inspired dark theme with:

- Smooth gradient backgrounds
- Purple accent colors (`#cba6f7`)
- Green success indicators (`#a6e3a1`)
- Subtle animations and transitions

## 🛠️ Development

### Prerequisites

- Google Chrome or Chromium-based browser
- Basic knowledge of Chrome Extension development

### Making Changes

1. Edit the source files as needed
2. Go to `chrome://extensions/`
3. Click the **refresh** icon on the extension card
4. Reload any YouTube tabs to see changes

### Debugging

- Right-click the extension popup → "Inspect" for popup debugging
- Right-click on YouTube → "Inspect" → Console for content script logs
- Check `chrome://extensions/` for error messages

## 👨‍💻 Author

Made by [@bochamaakram](https://github.com/bochamaakram)

---

## ⚠️ Disclaimer

This educational project uses a free API for audio downloads. Service is subject to the provider's usage quotas and will stop if limits are reached.
