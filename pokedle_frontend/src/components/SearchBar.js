import { useState, useEffect } from 'react';
import '../styles/SearchBar.css';
import { romanToNumber } from '../util';
import { BASE_API_URL } from '../constant';

function SearchBar({ value, onChange, onSubmit, onSelectSuggestion, disabled }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let abortController = new AbortController();

    const fetchSuggestions = async () => {
      if (!value || value.trim().length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_API_URL}/search?q=${encodeURIComponent(value)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Search results:', data);
          setSuggestions(Array.isArray(data) ? data : [data]);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // request cancelled
          return;
        }
        console.error('Search failed:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => {
      clearTimeout(debounceTimer);
      abortController.abort();
    };
  }, [value]);

  const handleSelectSuggestion = (suggestion) => {
    const pokemonName = typeof suggestion === 'string' ? suggestion : (suggestion.name || suggestion.pokemonName || JSON.stringify(suggestion));

    onChange({ target: { value: pokemonName } });
    onSelectSuggestion(pokemonName);

    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={(e) => {
    e.preventDefault();
    onSubmit(e);
  }}>
        <div className="input-wrapper">
          <div className='search-bar-input-container'>
            <input
              className='search-bar-input'
              id="pokemon-input"
              type="text"
              value={value}
              onChange={onChange}
              
              placeholder="Enter Pokémon name"
              autoComplete="off"
              autoFocus
              onFocus={() => value && setShowSuggestions(true)}
              disabled={disabled}
            />

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions-dropdown">
                {isLoading && <div className="suggestion-item loading">Loading...</div>}
                {!isLoading && suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="suggestion-item"
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      handleSelectSuggestion(suggestion);
                    }}
                  >
                    <div className="suggestion-content">
                      {typeof suggestion === 'string' ? (
                        <span>{suggestion}</span>
                      ) : (
                        <>
                          <span className="suggestion-name">{suggestion.pokemonName || suggestion.name || 'Unknown'}</span>
                          <span className="suggestion-details">
                            {suggestion.natId && `#${suggestion.natId}`}
                            {suggestion.generation && ` • Gen ${romanToNumber(suggestion.generation)}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
          <button type="submit" disabled={disabled} className='search-btn'>Guess</button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
