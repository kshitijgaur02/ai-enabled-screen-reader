chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Screen Reader Extension Installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startReading') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ status: 'No active tab found.' });
        return;
      }

      const tabId = tabs[0].id;

      // Inject contentScript.js manually if not already injected
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['contentScript.js']
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error injecting content script:', chrome.runtime.lastError.message);
          sendResponse({ status: 'Error: Content script injection failed.' });
          return;
        }

        console.log('Content script injected successfully.');

        // Now send the message to the injected content script
        chrome.tabs.sendMessage(tabId, { action: 'extractContent' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('Error sending message to content script:', chrome.runtime.lastError.message);
            sendResponse({ status: 'Error: Unable to extract content.' });
            return;
          }

          if (response && response.content) {
            // Send the extracted content to contentScript.js for AI processing
            chrome.tabs.sendMessage(tabId, { action: 'processWithAI', text: response.content });
            sendResponse({ status: 'Content sent to content script for processing.' });
          } else {
            sendResponse({ status: 'No content found to read.' });
          }
        });
      });

      return true;
    });

    return true;
  }
});
