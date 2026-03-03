import React, { useState, useEffect } from 'react';

const API_BASE = "http://192.168.11.34:8080/api/v1/game";

function App() {
  const [hint, setHint] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function loadHint() {
      try {
        const response = await fetch(`${API_BASE}/daily-info`);
        const data = await response.json();
        setHint(`Today's Pokemon has ${data.nameLength} letters and is from ${data.generation}.`);
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
      const response = await fetch(`${API_BASE}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pokemonName: name }),
      });

      if (response.status === 404) {
        alert('Pokemon not found in Pokedex!');
        return;
      }

      const result = await response.json();
      setResults(prev => [result, ...prev]);
      setGuessInput('');
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="app-container">
      <h1>Pokedle</h1>
      <p id="hint-text">{hint || 'Loading hint...'}</p>

      <form onSubmit={submitGuess}>
        <input
          id="pokemon-input"
          type="text"
          value={guessInput}
          onChange={(e) => setGuessInput(e.target.value)}
          placeholder="Enter Pokémon name"
        />
        <button type="submit">Guess</button>
      </form>

      <div id="results-container">
        {results.map((result, index) => (
          <div key={index} className="guess-result">
            <h3>Guess: {result.guess}</h3>
            <p>Letters: {result.fingerPrint.join(' | ')}</p>
            <ul>
              {result.attributeHints.map((attr, idx) => (
                <li key={idx}>
                  {attr.attributeName}: {attr.value} [{attr.status}]
                  {attr.direction === 'HIGHER' ? ' ↑' : ''}
                  {attr.direction === 'LOWER' ? ' ↓' : ''}
                </li>
              ))}
            </ul>
            {result.isWinner && <h2>🎉 YOU GOT IT! 🎉</h2>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;