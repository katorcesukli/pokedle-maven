import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import { BASE_API_URL } from '../constant';
import { usePokemonInfo } from '../hooks/use-pokemon-info';

function SecondGame() {
  const [guessInput, setGuessInput] = useState('');
  const [results, setResults] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [pokemonInfo, isLoading] = usePokemonInfo();

  const submitGuess = async (e) => {
    e.preventDefault();
    const name = guessInput.trim();
    if (!name) return;

    try {
      const response = await fetch(`${BASE_API_URL}/guess2`, {
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

  if (isLoading) {
    return <div className="app-container"><h1>Loading...</h1></div>;
  }

  return (
    <div className="app-container">
      <h1>Pokedle - Part 2</h1>
      <h3>Guess the Pokemon based on its Type, Weight, and Height!</h3>

      {pokemonInfo && (
        <div id="hints-display" style={{ fontSize: '18px', marginBottom: '20px' }}>
          <p><strong>Type:</strong> {pokemonInfo.type1}{pokemonInfo.type2 ? ` / ${pokemonInfo.type2}` : ''}</p>
          
          <p><strong>Weight:</strong> {pokemonInfo.weight} kg</p>
          <p><strong>Height:</strong> {pokemonInfo.height} m</p>
        </div>
      )}

      <SearchBar
        value={guessInput}
        onChange={(e) => setGuessInput(e.target.value)}
        onSubmit={submitGuess}
        onSelectSuggestion={(name) => setGuessInput(name)}
        disabled={isWinner}
      />

      <div id="results-container">
  {results.map((result, index) => (
    <div key={index} className="guess-result">
        
      <h3>Guess: {result.guess}</h3>

      {/* Attribute hints, safe for null */}
      {(result.attributeHints || []).length > 0 && (
        <ul>
          {result.attributeHints.map((attr, idx) => {
            const unit =
              attr.attributeName.toLowerCase().includes("weight")? " kg"
                : attr.attributeName.toLowerCase().includes("height")? " m": "";

            const directionSymbol =
              attr.direction === "HIGHER"
                ? " ↑"
                : attr.direction === "LOWER"
                ? " ↓"
                : "";

            return (
              <li key={idx}>
                {attr.attributeName}: {attr.value}
                {unit} [{attr.status}]
                {directionSymbol}
              </li>
            );
          })}
        </ul>
      )}

      <img
        src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${String(
          result.natId
        ).padStart(3, "0")}.png`}
        alt={result.guess}
      />
     
      {!result.isWinner && <h4> TRY AGAIN!</h4>}
      {result.isWinner && <h2>🎉 YOU GOT IT! 🎉</h2>}
    </div>
  ))}
</div>
    </div>
  );
}

export default SecondGame;
