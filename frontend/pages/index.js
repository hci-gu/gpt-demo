import React, { useState } from 'react';
import axios from 'axios';
import SpinningWheel from '@/components/SpinningWheel';

function App() {
  const [prompt, setPrompt] = useState('');
  // const [logprobs, setLogprobs] = useState({});
  const [words, setWords] = useState([]);
  const [pickedWord, setPickedWord] = useState('');
   
  const handleButtonClick = async () => {
    setPickedWord('')
    try {
      const response = await axios.post('http://localhost:5000/api/gpt2', {
        prompt: prompt
      });
      
      console.log(response.data);

      // setLogprobs(response.data.logprobs[0]);
      const logprobs = response.data.logprobs[0]
      setWords(Object.keys(logprobs).map((key, i) => ({
        word: key,
        probability: Math.exp(logprobs[key]),
        color: ['red', 'green', 'blue', 'yellow', 'brown'][i % 5]
      })))
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <label htmlFor="prompt">Enter text prompt:</label>
      <br />
      <textarea
        style={{ width: '100%', height: '3em' }}
        type="text"
        id="prompt"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <br />
      <button onClick={handleButtonClick}>Predict next</button>
      <br />
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '500px' }}>
        <table style={{ padding: '0', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '0.15em' }}>Word</th>
              <th style={{ border: '1px solid black', padding: '0.15em' }}>Probability</th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid black', padding: '0', margin: 0, fontWeight: word.word === pickedWord ? 'bold' : 'normal' }}>{word.word}</td>
                <td style={{ border: '1px solid black', padding: '0', margin: 0 }}>{(word.probability * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: '50%', width: '50%' }}>
          {words.length > 0 && <SpinningWheel
            words={words}
            onStop={(word) => {
              setPrompt(prompt + word)
              setPickedWord(word)
            }}
            />}
          </div>
        </div>
    </div>
  );
}

export default App;
