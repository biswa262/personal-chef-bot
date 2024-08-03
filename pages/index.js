// pages/index.js or components/YourComponent.js

import { useState } from 'react';

const predefinedQuestions = [
  'What are some basic cooking tips for beginners?',
  'How do I make a perfect omelette?',
  'What are the best methods for cooking vegetables?',
  'How can I make a homemade pizza dough?',
  'What are some quick and easy recipes for dinner?'
];

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredefinedClick = (predefinedQuestion) => {
    setQuestion(predefinedQuestion);
    handleAskClick();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cooking Bot</h1>

      <div style={{ marginBottom: '20px' }}>
        {predefinedQuestions.map((q, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <button 
              style={{ 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                backgroundColor: '#f5f5f5',
                cursor: 'pointer' 
              }}
              onClick={() => handlePredefinedClick(q)}
            >
              {q}
            </button>
          </div>
        ))}
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a cooking question..."
        style={{ width: '100%', height: '100px', marginBottom: '10px' }}
      />

      <button 
        onClick={handleAskClick}
        style={{ 
          padding: '10px', 
          border: '1px solid #ccc', 
          borderRadius: '5px', 
          backgroundColor: '#0070f3', 
          color: '#fff', 
          cursor: 'pointer' 
        }}
      >
        Ask
      </button>

      {loading && <p>Loading...</p>}

      {answer && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
