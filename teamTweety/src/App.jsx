import { useState } from 'react';
import './App.css';

function App() {
  const [response, setResponse] = useState('');
  const [inputText, setInputText] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      setResponse(data.response);

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const randomText =  
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'

  return (
    <>
      

      <div className='container'>
      <h1>Pandora Learning</h1>
      <p1>Where everyday lessons take center stage</p1>
        <div className='text-input'>
          <input
            type='text'
            placeholder='I want a lesson for four 8th graders about Retrievial Augmented Generation'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className='button'>
          <button onClick={handleSubmit}>Action!</button>
        </div>

        <div className='response-container'>
          <div className='response-text'>
            <p2>{randomText}</p2>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
