// ==UserScript==
// @name         YouTube Audio Downloader
// @namespace    https://github.com/bochamaakram
// @version      1.0.0
// @description  Download MP3 audio from YouTube videos with one click
// @author       bochamaakram
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      youtube-mp36.p.rapidapi.com
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // API Configuration
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

    // Add Catppuccin Mocha themed styles
    GM_addStyle(`
        /* Button container */
        #yt-audio-downloader-container {
            display: inline-flex;
            align-items: center;
            margin-left: 8px;
        }

        /* Main download button */
        #yt-audio-download-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 16px;
            background: linear-gradient(135deg, #cba6f7, #b4befe);
            color: #11111b;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Roboto', 'YouTube Sans', Arial, sans-serif;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 2px 10px rgba(203, 166, 247, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        #yt-audio-download-btn:hover {
            background: linear-gradient(135deg, #b4befe, #89b4fa);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(203, 166, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        #yt-audio-download-btn:active {
            transform: translateY(0);
            box-shadow: 0 2px 8px rgba(203, 166, 247, 0.3);
        }

        #yt-audio-download-btn:disabled {
            background: #45475a;
            color: #6c7086;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        #yt-audio-download-btn svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }

        #yt-audio-download-btn.loading svg {
            animation: ytadl-spin 1s linear infinite;
        }

        @keyframes ytadl-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* Toast notification */
        #yt-audio-toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            font-family: 'Roboto', Arial, sans-serif;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        }

        #yt-audio-toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        #yt-audio-toast.success {
            background: linear-gradient(135deg, #1e1e2e, #181825);
            color: #a6e3a1;
            border: 1px solid #a6e3a1;
        }

        #yt-audio-toast.error {
            background: linear-gradient(135deg, #1e1e2e, #181825);
            color: #f38ba8;
            border: 1px solid #f38ba8;
        }

        #yt-audio-toast.processing {
            background: linear-gradient(135deg, #1e1e2e, #181825);
            color: #cba6f7;
            border: 1px solid #cba6f7;
        }

        #yt-audio-toast svg {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        /* Download modal */
        #yt-audio-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(17, 17, 27, 0.8);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }

        #yt-audio-modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }

        #yt-audio-modal {
            background: linear-gradient(135deg, #1e1e2e, #181825);
            border: 1px solid #45475a;
            border-radius: 16px;
            padding: 32px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.9);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05);
            position: relative;
        }

        #yt-audio-modal-overlay.show #yt-audio-modal {
            transform: scale(1);
        }

        #yt-audio-modal h3 {
            color: #cba6f7;
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 600;
        }

        #yt-audio-modal p {
            color: #bac2de;
            margin: 0 0 24px 0;
            font-size: 14px;
        }

        #yt-audio-modal-video-title {
            color: #cdd6f4;
            font-weight: 500;
            display: block;
            margin-bottom: 16px;
            word-break: break-word;
        }

        #yt-audio-modal-download-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: linear-gradient(135deg, #a6e3a1, #94e2d5);
            color: #11111b;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 15px rgba(166, 227, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        #yt-audio-modal-download-btn:hover {
            background: linear-gradient(135deg, #94e2d5, #89dceb);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(166, 227, 161, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        #yt-audio-modal-download-btn svg {
            width: 20px;
            height: 20px;
        }

        #yt-audio-modal-close {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 32px;
            height: 32px;
            background: transparent;
            border: 1px solid #45475a;
            border-radius: 8px;
            color: #6c7086;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        }

        #yt-audio-modal-close:hover {
            background: #313244;
            color: #cdd6f4;
            border-color: #585b70;
        }

        #yt-audio-modal-icon {
            width: 64px;
            height: 64px;
            margin: 0 auto 16px;
            background: linear-gradient(135deg, #cba6f7, #b4befe);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #yt-audio-modal-icon svg {
            width: 32px;
            height: 32px;
            fill: #11111b;
        }
    `);

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

        setTimeout(() => toast.classList.add('show'), 10);

        if (type !== 'processing') {
            setTimeout(() => toast.classList.remove('show'), 4000);
        }

        return toast;
    }

    // Hide toast
    function hideToast() {
        const toast = document.getElementById('yt-audio-toast');
        if (toast) toast.classList.remove('show');
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

            overlay.querySelector('#yt-audio-modal-close').addEventListener('click', () => {
                overlay.classList.remove('show');
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.classList.remove('show');
            });
        }

        overlay.querySelector('#yt-audio-modal-video-title').textContent = videoTitle || 'YouTube Video';
        overlay.querySelector('#yt-audio-modal-download-btn').href = downloadLink;

        setTimeout(() => overlay.classList.add('show'), 10);
    }

    // Download audio using GM_xmlhttpRequest
    function downloadAudio() {
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

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
            headers: {
                'X-RapidAPI-Key': API_CONFIG.key,
                'X-RapidAPI-Host': API_CONFIG.host
            },
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);

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
                }

                if (button) {
                    button.disabled = false;
                    button.classList.remove('loading');
                    button.innerHTML = `${ICONS.download}<span>Download MP3</span>`;
                }
            },
            onerror: function (error) {
                console.error('YouTube Audio Downloader Error:', error);
                showToast('Network error. Please try again.', 'error');

                if (button) {
                    button.disabled = false;
                    button.classList.remove('loading');
                    button.innerHTML = `${ICONS.download}<span>Download MP3</span>`;
                }
            }
        });
    }

    // Create download button
    function createDownloadButton() {
        if (document.getElementById('yt-audio-downloader-container')) return;

        const actionsContainer = document.querySelector('#top-level-buttons-computed') ||
            document.querySelector('#menu-container') ||
            document.querySelector('ytd-menu-renderer');

        if (!actionsContainer) return;

        const container = document.createElement('div');
        container.id = 'yt-audio-downloader-container';

        const button = document.createElement('button');
        button.id = 'yt-audio-download-btn';
        button.innerHTML = `${ICONS.download}<span>Download MP3</span>`;
        button.addEventListener('click', downloadAudio);

        container.appendChild(button);
        actionsContainer.insertBefore(container, actionsContainer.firstChild);
    }

    // Remove button
    function removeDownloadButton() {
        const container = document.getElementById('yt-audio-downloader-container');
        if (container) container.remove();
    }

    // Initialize
    function init() {
        if (!window.location.pathname.includes('/watch')) {
            removeDownloadButton();
            return;
        }

        const checkInterval = setInterval(() => {
            const actionsContainer = document.querySelector('#top-level-buttons-computed') ||
                document.querySelector('#menu-container');

            if (actionsContainer) {
                clearInterval(checkInterval);
                createDownloadButton();
            }
        }, 500);

        setTimeout(() => clearInterval(checkInterval), 10000);
    }

    // Watch for URL changes (YouTube SPA)
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

})();
