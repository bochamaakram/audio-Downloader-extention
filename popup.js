// YouTube Audio Downloader - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('status');

    try {
        // Check if we're on a YouTube page
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab && tab.url && tab.url.includes('youtube.com')) {
            statusEl.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
        <span>Ready on YouTube</span>
      `;
            statusEl.classList.remove('inactive');
        } else {
            statusEl.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <span>Go to YouTube to use</span>
      `;
            statusEl.classList.add('inactive');
        }
    } catch (error) {
        console.error('Error checking tab:', error);
    }
});
