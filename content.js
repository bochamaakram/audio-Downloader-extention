// YouTube Audio Downloader - Content Script
// Uses the same RapidAPI as the React app

const API_CONFIG = {
    key: '6361936dd3msh89284aadb7f2091p171595jsnf0b9a24185a0',
    host: 'youtube-mp36.p.rapidapi.com'
};

// Icons
const ICONS = {
    download: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 2v2h14v-2H5z"/></svg>`,
    loading: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4" stroke-linecap="round"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

// Extract video ID from URL
function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// Get current video ID
function getCurrentVideoId() {
    return extractVideoId(window.location.href);
}

// Show toast notification
function showToast(message, type = 'processing') {
    let toast = document.getElementById('yt-audio-toast');

    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'yt-audio-toast';
        document.body.appendChild(toast);
    }

    const icon = type === 'success' ? ICONS.success :
        type === 'error' ? ICONS.error : ICONS.loading;

    toast.innerHTML = `${icon}<span>${message}</span>`;
    toast.className = type;

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto-hide after 4 seconds (except for processing)
    if (type !== 'processing') {
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    return toast;
}

// Hide toast
function hideToast() {
    const toast = document.getElementById('yt-audio-toast');
    if (toast) {
        toast.classList.remove('show');
    }
}

// Show download modal
function showDownloadModal(downloadLink, videoTitle) {
    let overlay = document.getElementById('yt-audio-modal-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'yt-audio-modal-overlay';
        overlay.innerHTML = `
      <div id="yt-audio-modal">
        <button id="yt-audio-modal-close">${ICONS.close}</button>
        <div id="yt-audio-modal-icon">${ICONS.music}</div>
        <h3>Download Ready!</h3>
        <span id="yt-audio-modal-video-title"></span>
        <p>Your MP3 file is ready to download</p>
        <a id="yt-audio-modal-download-btn" href="#" target="_blank" rel="noopener">
          ${ICONS.download} Download MP3
        </a>
      </div>
    `;
        document.body.appendChild(overlay);

        // Close button handler
        overlay.querySelector('#yt-audio-modal-close').addEventListener('click', () => {
            overlay.classList.remove('show');
        });

        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });
    }

    // Set content
    overlay.querySelector('#yt-audio-modal-video-title').textContent = videoTitle || 'YouTube Video';
    overlay.querySelector('#yt-audio-modal-download-btn').href = downloadLink;

    // Show modal
    setTimeout(() => overlay.classList.add('show'), 10);
}

// Download audio
async function downloadAudio() {
    const videoId = getCurrentVideoId();

    if (!videoId) {
        showToast('Could not find video ID', 'error');
        return;
    }

    const button = document.getElementById('yt-audio-download-btn');
    if (button) {
        button.disabled = true;
        button.classList.add('loading');
        button.innerHTML = `${ICONS.loading}<span>Processing...</span>`;
    }

    showToast('Converting video to MP3...', 'processing');

    try {
        const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': API_CONFIG.key,
                'X-RapidAPI-Host': API_CONFIG.host
            }
        });

        const data = await response.json();

        if (data.status === 'ok' && data.link) {
            hideToast();
            showToast('Download ready!', 'success');
            showDownloadModal(data.link, data.title);
        } else {
            throw new Error(data.msg || 'Failed to process video');
        }
    } catch (error) {
        console.error('YouTube Audio Downloader Error:', error);
        showToast(error.message || 'Download failed. Please try again.', 'error');
    } finally {
        if (button) {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = `${ICONS.download}<span>Download MP3</span>`;
        }
    }
}

// Create download button
function createDownloadButton() {
    // Check if button already exists
    if (document.getElementById('yt-audio-downloader-container')) {
        return;
    }

    // Find the action buttons container (below the video)
    const actionsContainer = document.querySelector('#top-level-buttons-computed') ||
        document.querySelector('#menu-container') ||
        document.querySelector('ytd-menu-renderer');

    if (!actionsContainer) {
        return;
    }

    // Create button container
    const container = document.createElement('div');
    container.id = 'yt-audio-downloader-container';

    // Create button
    const button = document.createElement('button');
    button.id = 'yt-audio-download-btn';
    button.innerHTML = `${ICONS.download}<span>Download MP3</span>`;
    button.addEventListener('click', downloadAudio);

    container.appendChild(button);

    // Insert at the beginning of actions container
    actionsContainer.insertBefore(container, actionsContainer.firstChild);
}

// Remove button (for navigation)
function removeDownloadButton() {
    const container = document.getElementById('yt-audio-downloader-container');
    if (container) {
        container.remove();
    }
}

// Initialize on video page
function init() {
    // Only run on video watch pages
    if (!window.location.pathname.includes('/watch')) {
        removeDownloadButton();
        return;
    }

    // Wait for YouTube's dynamic content to load
    const checkInterval = setInterval(() => {
        const actionsContainer = document.querySelector('#top-level-buttons-computed') ||
            document.querySelector('#menu-container');

        if (actionsContainer) {
            clearInterval(checkInterval);
            createDownloadButton();
        }
    }, 500);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
}

// Watch for URL changes (YouTube is a SPA)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        removeDownloadButton();
        init();
    }
}).observe(document.body, { subtree: true, childList: true });

// Initial run
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
