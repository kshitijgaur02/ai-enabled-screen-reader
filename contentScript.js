(() => {
  let utterance = null;

  const extractContent = () => {
    console.log('Extracting content...');
    const elements = document.querySelectorAll('h1, h2, h3, p, a, button');
    let content = '';

    elements.forEach(element => {
      const tag = element.tagName.toLowerCase();
      const text = element.innerText.trim();

      if (text) {
        if (tag === 'a') content += `Link: ${text}. `;
        else if (tag === 'button') content += `Button: ${text}. `;
        else content += `${text} `;
      }
    });

    console.log('Content extracted successfully.');
    return content;
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractContent') {
      console.log('Content extraction message received.');
      const content = extractContent();
      sendResponse({ content });
    }

    if (message.action === 'processWithAI' && message.text) {
      console.log('Message received to process text with AI.');
      
      import(chrome.runtime.getURL('utils.js'))
        .then(({ processWithAI, speakText }) => {
          processWithAI(message.text)
            .then(improvedText => {
              console.log('Text processed successfully.');
              
              // Speak the processed text
              utterance = speakText(improvedText);
              
              sendResponse({ status: 'Text processed and spoken successfully.' });
            })
            .catch(error => {
              console.error('Error processing text:', error);
              sendResponse({ status: 'Error processing text.' });
            });
        })
        .catch(error => console.error('Error importing utils.js:', error));

      return true; // Keep message channel open
    }

    if (message.action === 'stopSpeaking') {
      if (utterance) {
        console.log('Stopping the narration.');
        window.speechSynthesis.cancel(); // Stops the current narration
        utterance = null;
      }
    }
  });
})();
