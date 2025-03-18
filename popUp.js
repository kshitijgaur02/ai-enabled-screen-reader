document.addEventListener('DOMContentLoaded', () => {
    const startReadingBtn = document.getElementById('startReadingBtn');
    const stopReadingBtn = document.getElementById('stopReadingBtn');

    if (startReadingBtn) {
        startReadingBtn.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'startReading' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message to background:', chrome.runtime.lastError.message);
                } else if (response && response.status) {
                    console.log('Background Response:', response.status);
                }
            });
        });
    }

    if (stopReadingBtn) {
        stopReadingBtn.addEventListener('click', () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs.length > 0) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSpeaking' });
                }
            });
        });
    }
});
