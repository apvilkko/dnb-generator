export const randRange = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const sample = arr => (arr.length > 0 ? arr[randRange(0, arr.length - 1)] : undefined);

export const rand = value => Math.random() < (value / 100.0);

const randInt = max => Math.floor(Math.random() * max);

function swap(arr, i, j) {
  // swaps two elements of an array in place
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

export const shuffle = list => {
  const arr = [...list];
  for (let slot = arr.length - 1; slot > 0; slot--) { // eslint-disable-line
    const element = randInt(slot + 1);
    swap(arr, element, slot);
  }
  return arr;
};

export const takeRandom = (num, arr) => shuffle(arr).slice(0, num);
