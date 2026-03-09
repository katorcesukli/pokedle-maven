import React, { useState, useEffect } from 'react';
import LetterGrid from './components/LetterGrid';
import SearchBar from './components/SearchBar';

//const API_BASE = "http://"my pc's ip":8080/api/v1/game";
const API_BASE = "https://kind-achievement-production.up.railway.app/api/v1/game";

function romanToNumber(roman) {
  if (!roman || typeof roman !== 'string') return roman;
  
  const romanNumerals = {
    'generation-i': 1, 'generation-ii': 2, 'generation-iii': 3,
    'generation-iv': 4, 'generation-v': 5, 'generation-vi': 6,
    'generation-vii': 7, 'generation-viii': 8, 'generation-ix': 9,
    'generation-x': 10
  };
  
  return romanNumerals[roman.toLowerCase()] || roman;
}

function App() {
  const [hint, setHint] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function loadHint() {
      try {
        const response = await fetch(`${API_BASE}/daily-info`);
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
      console.log('Full API Response:', result);
      console.log('isWinner:', result.isWinner);
      setResults(prev => [result, ...prev]);
      setGuessInput('');
    } catch (err) {
      alert('Error connecting to server.');
    }
  };

  return (
    <div className="app-container">
      <h1>Pokedle</h1>
        <h3>
    GREEN - Correct Letter and Placement<br></br>
    YELLOW - Correct Letter but wrong Placement<br></br>
    RED - Letter not in name<br></br>
    GREY - Letter has exceeded name count<br></br>
        </h3>
      <p id="hint-text">{hint || 'Loading hint...'}</p>

      <SearchBar
        value={guessInput}
        onChange={(e) => setGuessInput(e.target.value)}
        onSubmit={submitGuess}
        onSelectSuggestion={(name) => setGuessInput(name)}
      />

      <div id="results-container">
        {results.map((result, index) => (
          <div key={index} className="guess-result">
            <h3>Guess: {result.guess}</h3>
            <LetterGrid letters={result.guess.split('')} statuses={result.fingerPrint} />
            <ul>
              {result.attributeHints.map((attr, idx) => (
                <li key={idx}>
                  {attr.attributeName}: {romanToNumber(attr.value)} [{attr.status}]
                  {attr.direction === 'HIGHER' ? ' ↑' : ''}
                  {attr.direction === 'LOWER' ? ' ↓' : ''}
                </li>
              ))}
            </ul>
            <img src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${String(result.natId).padStart(3, '0')}.png`}/>
            {result.isWinner && <h2>🎉 YOU GOT IT! 🎉</h2>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;