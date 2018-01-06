import {sample} from './random';

const createPattern = (numBars, hitMap) => {
  const pattern = [];
  const len = numBars * 16;
  const choices = hitMap.map(v => v.time);
  for (let i = 0; i < len; ++i) {
    pattern.push(null);
  }
  let i = 0;
  let skip;
  while (i < pattern.length) {
    const randomSlice = sample(hitMap);
    pattern[i] = randomSlice;
    const skipChoices = [2];
    // If slice is near the end it can't be played as long (could loop, TODO)
    if (randomSlice.index + 2 <= choices.length) {
      skipChoices.push(4);
    }
    if (randomSlice.index + 4 <= choices.length) {
      skipChoices.push(6);
    }
    skip = sample(skipChoices);
    i += skip;
  }
  return pattern;
};

export default createPattern;
