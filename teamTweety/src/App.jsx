import React from 'react';
import { useState } from 'react';
import './App.css';

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

      console.log('Sending userQuery:', userQuery);

      const data = await response.json();
      setResponse(data.generatedScript);
      //setResponse(data.respons);
    } catch (error) {
      console.error('Error submitting form:', error);
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
            <p>{response}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
