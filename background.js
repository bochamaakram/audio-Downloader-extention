// YouTube Audio Downloader - Background Service Worker
// Handles extension icon clicks and context menu

chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube Audio Downloader extension installed');
});

// Handle messages from content script (if needed in future)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadComplete') {
        console.log('Download completed:', request.title);
    }
    return true;
});
