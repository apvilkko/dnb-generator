import {sample, randRange, takeRandom, rand} from './random';

const randSub = rootPitch => ({pitch: rootPitch + randRange(-2, 10)});
const empty = len => {
  const pattern = [];
  for (let i = 0; i < len; ++i) {
    pattern.push(null);
  }
  return pattern;
}

const subAlgos = [

  // rush start + ending fill
  (len, rootPitch) => {
    const pattern = empty(len);
    const startChoices = [1, 2, 3, 4];
    [0].concat(takeRandom(randRange(1, 4), startChoices)).forEach(index => {
      pattern[index * 2] = randSub(rootPitch);
    });
    const endChoices = [-4, -6, -8];
    takeRandom(randRange(0, 2), endChoices).forEach(index => {
      pattern[len + index] = randSub(rootPitch);
    });
    return pattern;
  },

  // start root + end rush
  (len, rootPitch) => {
    const pattern = empty(len);
    pattern[0] = rootPitch;
    const endChoices = [-2, -4, -6, -8, -10];
    takeRandom(randRange(1, 5), endChoices).forEach(index => {
      pattern[len + index] = randSub(rootPitch);
    });
    return pattern;
  },

  // follow drums
  (len, rootPitch, drumloop) => {
    const pattern = empty(len);
    for (let i = 0; i < len; ++i) {
      const v = drumloop[i % drumloop.length]
      if (v && (v.hit === 'k' || v.hit === 's' || v.hit === 'c') &&
          i % 2 === 0 && rand(i === 0 ? 100 : 50)) {
        pattern[i] = randSub(rootPitch);
      }
    }
    if (!pattern[0]) {
      pattern[0] = randSub(rootPitch);
    }
    return pattern;
  },
];


const drumloopAlgos = [

  // random 2-4-6s
  (len, hitMap) => {
    const pattern = empty(len);
    const choices = hitMap.map(v => v.time);
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
  },

  // kicks + snares + crashes
  (len, hitMap) => {
    const pattern = empty(len);
    const snare = hitMap.filter(v => v.hit === 's')[0];
    const tweens = hitMap.filter(v => v.hit === 't');
    const kick = hitMap.filter(v => v.hit === 'k')[0];
    const crash = hitMap.filter(v => v.hit === 'c')[0];
    const choices = hitMap.map(v => v.time);
    let i = 0;
    let skip;
    while (i < pattern.length) {
      // Emphasize snare on second quarter
      const randomSlice = rand(((i - 4) % 16 === 0) ? 80 : 50) ? snare : kick;
      pattern[i] = randomSlice;
      if (randomSlice === snare && i > 1 && rand(25)) {
        let fillSnare = randomSlice;
        if (rand(40)) {
          fillSnare = Object.assign({}, randomSlice, {pitch: randRange(-1, 1)});
        }
        pattern[i - 1] = fillSnare;
      }
      const skipChoices = [2];
      if (randomSlice.index + 2 <= choices.length) {
        skipChoices.push(4);
      }
      if (randomSlice.index + 4 <= choices.length) {
        skipChoices.push(6);
      }
      skip = sample(skipChoices);
      if (i === 0 && skip === 2 && rand(70)) {
        skip = sample([4, 6]);
      }
      if ((skip === 4 || skip === 6) && rand(50)) {
        const tweenIndex = i + (skip === 4 ? 2 : 4);
        if (tweenIndex < len) {
          pattern[tweenIndex] = sample(tweens);
        }
      }
      i += skip;
    }
    const amountCrashes = randRange(0, 3);
    for (let i = 0; i < amountCrashes; ++i) {
      let index = randRange(0, (len - 2) / 2) * 2;
      // Emphasize 0
      if (i === 0 && rand(75)) {
        index = 0;
      }
      pattern[index] = crash;
    }
    return pattern;
  },
]

const sparse = (len, rootPitch) => {
  const pattern = empty(len);
  for (let i = 0 ; i < len; ++i) {
    if (i % 2 === 0 && rand(4)) {
      pattern[i] = {pitch: rootPitch + randRange(-7, 7)}
    }
  }
  return pattern;
}

const createPattern = (hitMap) => {
  const rootPitch = randRange(-4, 4);
  const len = [sample([2,4]), sample([2,4]), sample([2,4]), sample([4,8]), sample([4,8])].map(x => x * 16)
  const drumloop = sample(drumloopAlgos)(len[0], hitMap);
  const drumloop2 = sample(drumloopAlgos)(len[1], hitMap);
  return {
    drumloop,
    drumloop2,
    sub: sample(subAlgos)(len[2], rootPitch, drumloop),
    fx: sparse(len[3], rootPitch),
    stab: sparse(len[4], rootPitch),
  };
};

export default createPattern;
