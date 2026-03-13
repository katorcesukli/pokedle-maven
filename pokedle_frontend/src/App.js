import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FirstGame  from './pages/FirstGame'
import SecondGame from './pages/SecondGame';
import './styles/Confetti.css';
import { BASE_API_URL } from './constant';

function App() {
  const [hint, setHint] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [results, setResults] = useState([]);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    async function loadHint() {
      try {
        const response = await fetch(`${BASE_API_URL}/daily-info`);
        const data = await response.json();
        setHint(`Today's Pokemon has ${data.nameLength} letters.`);
      } catch (err) {
        console.error('Failed to load game info:', err);
      }
    }
    loadHint();
  }, []);

  const submitGuess = async (e) => {
    e.preventDefault();
    const name = guessInput.trim();
    if (!name) return;

    try {
      const response = await fetch(`${BASE_API_URL}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonName: name }),
      });

      if (response.status === 404) {
        alert('Pokemon not found in Pokedex!');
        return;
      }

      const result = await response.json();
      console.log('Full API Response:', result);
      console.log('isWinner:', result.isWinner);
      setResults(prev => [result, ...prev]);
      setGuessInput('');
      if (result.isWinner) {
        setIsWinner(true);
      }
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <FirstGame
            hint={hint}
            guessInput={guessInput}
            setGuessInput={setGuessInput}
            submitGuess={submitGuess}
            isWinner={isWinner}
            results={results}
          />
        }
      />
      <Route path="/part2" element={<SecondGame />} />
    </Routes>
  );
}

export default App;