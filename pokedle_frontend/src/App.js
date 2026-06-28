import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FirstGame  from './pages/FirstGame'
import SecondGame from './pages/SecondGame';
import './styles/Confetti.css';
import { BASE_API_URL, MAX_GUESSES } from './constant';
import { useHint } from './hooks/use-hint';
import { wakeBackend } from './services/api';

function App() {
  const [guessInput, setGuessInput] = useState('');
  const [results, setResults] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  
  const [ hint ] = useHint()

  // Wake up the backend when the app loads
  const [backendReady, setBackendReady] = useState(false);
  useEffect(() => {
    wakeBackend().then(() => setBackendReady(true));
  }, []);

  if(!backendReady){
  return <h2>Loading Pokedle...this might take some time so be patient</h2>
}

  const submitGuess = async (e) => {
    e.preventDefault();

    if (results.length >= MAX_GUESSES) {
        return;
      }

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