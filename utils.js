// AI Text Processing Function
export async function processWithAI(text) {
  console.log('Processing text with AI:', text);
  const apiKey = 'API key';
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
      const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
              model: 'gpt-4',
              messages: [{ role: 'user', content: `Improve this text for accessibility: ${text}` }],
              temperature: 0.7
          })
      });

      const data = await response.json();
      return data.choices[0].message.content;
  } catch (error) {
      console.error('AI Processing Error:', error);
      return text; // Return original text if AI processing fails
  }
}

// Text-to-Speech Function
export function speakText(text) {
  console.log('Speaking text:', text);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.lang = 'en-US';
  speechSynthesis.speak(utterance);
}
