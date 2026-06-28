import '../styles/ResultScreen.css';
import { useState } from 'react';

function ResultScreen({ results, isWinner }) {

  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
  return null;
}

  const getEmojiGrid = () => {
    return results
      .map((result) =>
        result.fingerPrint
          .map((status) => {
            if (status === "CORRECT") return "🟩";
            if (status === "PRESENT") return "🟨";
            if (status === "ABSENT") return "🟥";
            return "⬛";
          })
          .join('')
      )
      .join('\n');
  };


  const shareText = 
`Pokedle by Katorcesukli and friends

${isWinner ? "Solved! Got it!" : "Failed!"}
${results.length}/6 guesses

${getEmojiGrid()}

Play here:
https://pokedle-maven.vercel.app/`;


  const copyResult = () => {
    navigator.clipboard.writeText(shareText);
    alert("Result copied!");
  };


  return (
    <div className="result-overlay">
      <div className="result-screen">
        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>

        <h2>
          {isWinner
            ? "🎉 YOU GOT IT!"
            : "GAME OVER"}
        </h2>


        <h3>
          {results.length}/6 guesses
        </h3>


        <div className="share-grid">

        {results.map((result, index) => (

          <div 
            key={index}
            className="share-row"
          >

            {result.fingerPrint.map((status, i) => {

              let emoji = "⬛";

              if(status === "CORRECT"){
                emoji = "🟩";
              }
              else if(status === "PRESENT"){
                emoji = "🟨";
              }
              else if(status === "ABSENT"){
                emoji = "🟥";
              }

              return (
                <span key={i}>
                  {emoji}
                </span>
              );

            })}

          </div>

        ))}

      </div>


      <button 
        onClick={copyResult}
        className="copy-btn"
      >
        Copy Result
      </button>

        <div className="donation-section">
            <p>
                Enjoying Pokedle? Buy me a coffee ❤️ GCash below
            </p>
        <img
            className="donation-qr"
            src="/donation-qr.png"
            alt="Donation QR Code"
        />
        </div>
      </div>
    </div>
  );
}


export default ResultScreen;