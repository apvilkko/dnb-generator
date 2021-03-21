import createAudioEngine from './audioengine';
import loadSample from './loadsample';
import createPattern from './pattern';
import generateHitMap from './hitmap';
import {randRange, sample} from './random';
import startTick from './worker';
import catalog, {bassCatalog} from './catalog';
import {tick, togglePlay} from './sequencer';
import store from './store';

let engine;

const randomBassSample = () => sample(Object.keys(bassCatalog))
const randomDrumSample = () => sample(Object.keys(catalog))

const generate = (sampleName, bassSample) => {
  const tempo = randRange(160, 180);
  const sampleTempo = catalog[sampleName].bpm;
  const hitMap = generateHitMap(sampleName);
  const numBars = sample([2, 4]);
  const pattern = createPattern(numBars, hitMap);
  store.setPattern(pattern);
  store.setTempo(tempo);
  console.log(tempo, sampleName, bassSample, pattern);
  const samples = {
    drumloop: {name: sampleName, gain: catalog[sampleName].gain || 1.0},
    sub: {gain: bassCatalog[bassSample].gain || 0.6, name: bassSample},
  };
  return {
    playbackRate: tempo / sampleTempo * .99,
    samples,
    tempo,
    pattern,
    store,
  };
};

const generateNew = () => {
  const sampleName = randomDrumSample()
  const bassSample = randomBassSample()
  loadSample(engine.context, engine.buffers, sampleName);
  loadSample(engine.context, engine.buffers, bassSample);
  engine.scene = generate(sampleName, bassSample);
}

let inited = false

const init = (isProd) => {
  if (!isProd) {
    engine = createAudioEngine();
    generateNew()
    startTick(engine, tick);
    inited = true
  }
};

export const actions = (isProd) => ({
  newScene: () => { generateNew() },
  togglePlay: () => {
    if (!inited && isProd) {
      init(false)
    } else {
      togglePlay()
    }

  }
});

export default init;
