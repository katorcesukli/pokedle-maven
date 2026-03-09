import React from 'react';
import '../styles/LetterGrid.css';

function LetterGrid({ letters, statuses }) {
  console.log('Letters:', letters);
  console.log('Statuses:', statuses);

  return (
    <div className="letter-grid">
      {letters && letters.map((letter, index) => {
        let statusClass = 'default';
        
        if (statuses && statuses[index]) {
          const status = statuses[index].toLowerCase();
          if (status === 'correct') {
            statusClass = 'correct';
          } else if (status === 'present') {
            statusClass = 'wrongposition';
          } else if (status === 'absent') {
            statusClass = 'absent';
          }
        }
        
        return (
          <div
            key={index}
            className={`letter-box ${statusClass}`}
          >
            <span className="letter-text">{letter}</span>
          </div>
        );
      })}
    </div>
  );
}

export default LetterGrid;
