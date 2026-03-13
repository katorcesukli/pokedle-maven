import '../styles/GuessAttribute.css';
import LetterGrid from './LetterGrid';
import { romanToNumber } from '../util';

function GuessResult( { result } ){
    
    return (
    <>
        <LetterGrid
            letters={result.guess.split('')}
            statuses={result.fingerPrint}
        />

        <img 
            className='guess-img'
            loading='lazy' 
            src={`https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${String(result.natId).padStart(3, '0')}.png`} 
            />

        <ul className='guess-attribute-container'>
            {result.attributeHints.map((attr, idx) => (
            <li key={idx} className={`${attr.status === "WRONG" ? 'guess-wrong' : 'guess-correct'} guess-attribute`}>
                {attr.attributeName}: {romanToNumber(attr.value)}

                {attr.attributeName.toLowerCase().includes('weight')
                ? ' kg'
                : attr.attributeName.toLowerCase().includes('height')
                ? ' m'
                : ''}{' '}
                {attr.direction === 'HIGHER' ? ' ↑' : ''}
                {attr.direction === 'LOWER' ? ' ↓' : ''}
            </li>
            ))}
        </ul>
    </>
    )
}

export default GuessResult;