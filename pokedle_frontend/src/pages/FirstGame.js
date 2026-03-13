import SearchBar from '../components/SearchBar.js'
import GuessResult from '../components/GuessResult.js'

function FirstGame({
  hint,
  guessInput,
  setGuessInput,
  submitGuess,
  isWinner,
  results
}) {

  console.log(results)
  return (
    <div className="app-container">
      <h1>Pokedle</h1>

      <h3>
        <span className='green-result'>GREEN</span> - Correct Letter and Placement<br />
        <span className='yellow-result'>YELLOW</span> - Correct Letter but wrong Placement<br />
        <span className='red-result'>RED</span> - Letter not in name<br />
        <span className='grey-result'>GREY</span> - Letter has exceeded name count<br />
      </h3>

      <p id="hint-text">{hint || 'Loading hint...'}</p>

      <SearchBar
        value={guessInput}
        onChange={(e) => setGuessInput(e.target.value)}
        onSubmit={submitGuess}
        onSelectSuggestion={(name) => setGuessInput(name)}
        disabled={isWinner}
      />

      {isWinner && (
        <Link to="/part2">
          <button style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
            Play Part 2
          </button>
        </Link>
      )}

      <div id="results-container">
        {results.map((result, index) => (
          <div key={index} className="guess-result">
            <h3>Guess: {result.guess}</h3>
            {!result.isWinner && <h4> TRY AGAIN!</h4>}
            <GuessResult 
                result={result}
            />
            {result.isWinner && <h2>🎉 YOU GOT IT! 🎉</h2>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FirstGame;