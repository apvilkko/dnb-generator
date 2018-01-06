export const randRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const sample = arr => (arr.length > 0 ? arr[randRange(0, arr.length - 1)] : undefined);
