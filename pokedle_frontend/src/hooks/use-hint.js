import { useState } from "react";
import { useEffect } from "react";
import { BASE_API_URL } from "../constant";

function useHint(){
    const [hint, setHint] = useState('');
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

    return [hint, setHint]
}

export {
    useHint
}