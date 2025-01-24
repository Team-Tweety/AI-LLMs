import React from 'react';
import { useState } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';

function App() {
  const [response, setResponse] = useState(
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
  );
  const [userQuery, setUserQuery] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ userQuery }),
      });

      console.log('Response status:', response.status);
      const text = await response.text(); // Get the raw response text
      console.log('Raw response:', text);

      try {
        const data = JSON.parse(text); // Try to parse it as JSON
        setResponse(data.generatedScript);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        setResponse('Error: Failed to get proper response from server');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponse('Error: Failed to connect to server');
    }
  };

  return (
    <>
      <div className='container'>
        <h1>Pandora Learning</h1>
        <h3>Where everyday lessons take center stage</h3>
        <div className='text-input'>
          <input
            type='text'
            placeholder='I want a lesson for four 8th graders about Retrievial Augmented Generation'
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
          />
        </div>

        <div className='button'>
          <button onClick={handleSubmit}>Action!</button>
        </div>

        <div className='response-container'>
          <div className='response-text'>
            <ReactMarkdown>{response}</ReactMarkdown>
            {/* <p>{response}</p> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
