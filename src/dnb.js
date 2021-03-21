import createAudioEngine, {addMixer} from './audioengine';
import loadSample from './loadsample';
import createPattern from './pattern';
import generateHitMap from './hitmap';
import {randRange, sample} from './random';
import startTick from './worker';
import catalog, {bassCatalog, fx, stabs} from './catalog';
import {tick, togglePlay} from './sequencer';
import store from './store';

let engine;

const randomStab = () => sample(Object.keys(stabs))
const randomFx = () => sample(Object.keys(fx))
const randomBassSample = () => sample(Object.keys(bassCatalog))
const randomDrumSample = () => sample(Object.keys(catalog))

const generate = (smpls) => {
  const [sampleName, dr2sample, bassSample, stabSample, fxSample] = smpls
  const tempo = randRange(160, 180);
  const sampleTempo = catalog[sampleName].bpm;
  const hitMap = generateHitMap(sampleName);
  const pattern = createPattern(hitMap);
  store.setPattern(pattern);
  store.setTempo(tempo);
  console.log(tempo, sampleName, dr2sample, bassSample, pattern, stabSample, fxSample);
  const samples = {
    drumloop: {name: sampleName, gain: catalog[sampleName].gain || 1.0},
    drumloop2: {name: dr2sample, gain: sample([(catalog[dr2sample].gain || 1.0) * randRange(0.3, 1.0), 0])},
    sub: {gain: bassCatalog[bassSample].gain || 0.6, name: bassSample},
    stab: {gain: stabs[stabSample].gain || 0.6, name: stabSample},
    fx: {gain: fx[fxSample].gain || 0.6, name: fxSample},
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
  const dr1 = randomDrumSample()
  let dr2 = randomDrumSample()
  while (dr2 === dr1) {
    dr2 = randomDrumSample()
  }
  const samples = [dr1, dr2, randomBassSample(), randomStab(), randomFx()]
  samples.forEach(s => loadSample(engine.context, engine.buffers, s))
  engine.scene = generate(samples);
}

let inited = false

const init = (isProd) => {
  if (!isProd) {
    engine = createAudioEngine();
    loadSample(engine.context, engine.buffers, 'impulse1').then(() => {
      addMixer(engine)
      generateNew()
      startTick(engine, tick);
      inited = true
    })
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
  },
  adjustVolume: evt => {
    engine.mixer.master.gain.value = (evt.target.value || 50) / 100.0
  }
});

export default init;
