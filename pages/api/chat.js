// pages/api/chat.js

import axios from 'axios';

export default async function handler(req, res) {
  console.log('API Key:', process.env.OPENAI_API_KEY); // Log the API key for verification

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: 'Please provide a question' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `You are a chef bot. Answer this cooking question: ${question}` }],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log('OpenAI Response:', response.data);

    const answer = response.data.choices[0].message.content.trim();

    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error.message);
    if (error.response) {
      if (error.response.status === 429) {
        return res.status(429).json({ message: 'Quota exceeded. Please try again later.' });
      }
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    return res.status(500).json({ message: 'Error communicating with OpenAI', error: error.message });
  }
}
