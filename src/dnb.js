import createAudioEngine from './audioengine';
import loadSample from './loadsample';
import createPattern from './pattern';
import generateHitMap from './hitmap';
import {randRange, sample} from './random';
import startTick from './worker';
import catalog from './catalog';
import {tick} from './sequencer';
import store from './store';

let engine;

const generate = () => {
  const sampleName = 'amen1';
  const tempo = randRange(160, 180);
  const sampleTempo = catalog[sampleName].bpm;
  const hitMap = generateHitMap(sampleName);
  const numBars = sample([2, 4]);
  const pattern = createPattern(numBars, hitMap);
  store.setPattern(pattern);
  store.setTempo(tempo);
  console.log(tempo, sampleTempo, pattern);
  const samples = {
    drumloop: sampleName,
    sub: 'sub1',
  };
  return {
    playbackRate: tempo / sampleTempo * .99,
    samples,
    tempo,
    pattern,
    store,
  };
};

const init = () => {
  engine = createAudioEngine();
  loadSample(engine.context, engine.buffers, 'amen1');
  loadSample(engine.context, engine.buffers, 'sub1');
  engine.scene = generate();
  startTick(engine, tick);
};

export const actions = {
  newScene: () => { engine.scene = generate(); },
};

export default init;
