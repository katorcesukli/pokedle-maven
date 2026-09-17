import '../styles/ResultScreen.css';
import { useState } from 'react';

const emojiColorMapping = {
  "CORRECT": "🟩",
  "PRESENT": "🟨",
  "ABSENT": "🟥",
}

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
            if (emojiColorMapping[status]) return emojiColorMapping[status];
            else return "⬛";
          })
          .join('')
      )
      .join('\n');
  };

  const shareText = 
    "Pokedle by Katorcesukli and friends" +
    `\n\n${isWinner ? "Solved! Got it!" : "Failed!"}` +
    `\n${results.length}/6 guesses` +
    `\n\n${getEmojiGrid()}` +
    "\n\nPlay here:" +
    "\nhttp://172.17.202.103:8081/"
  ;

  const copyResult = () => {
    copyToClipboard(shareText);
    alert("Result copied!");
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {

      // fallback approach, mainly for local development
      return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        
        textarea.focus();
        textarea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            resolve();
          } else {
            reject(new Error('Fallback copy failed'));
          }
        } catch (err) {
          reject(err);
        } finally {
          textarea.remove();
        }
      });
    }
  }

  return (
    <div className="result-overlay">
      <div className="result-screen">
        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>

        <h2>
          {isWinner ? "🎉 YOU GOT IT!" : "GAME OVER"}
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
              {
                result.fingerPrint.map((status, i) => {
                    let emoji = "⬛";
                    if(emojiColorMapping[status]){
                      emoji = emojiColorMapping[status];
                    }
                    return (
                      <span key={i}>
                        {emoji}
                      </span>
                    );
                })
              }
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