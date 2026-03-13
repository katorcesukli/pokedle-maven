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

export { romanToNumber }