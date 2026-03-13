import { useEffect, useState } from "react";
import { BASE_API_URL } from "../constant";


function usePokemonInfo(){
    const [pokemonInfo, setPokemonInfo] = useState('');
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPokemonInfo() {
          try {
            const response = await fetch(`${BASE_API_URL}/daily-info2`);
            const data = await response.json();
            console.log('Pokemon Info Response:', data);
            setPokemonInfo(data);
            setLoading(false);
          } catch (err) {
            console.error('Failed to load pokemon info:', err);
            setLoading(false);
          }
        }
        loadPokemonInfo();
      }, []);

      return [pokemonInfo, isLoading]
}

export {
    usePokemonInfo
}