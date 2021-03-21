import createMixer from './mixer';

const createAudioEngine = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const buffers = {}
  return {
    context,
    buffers,
    scene: {
      tempo: 170,
      pattern: {
        drumloop: [],
        drumloop2: [],
        sub: [],
        fx: [],
        stab: []
      },
    },
    sequencer: {
      currentNote: 0,
      lastTickTime: context.currentTime,
    },
  }
};

export const addMixer = (engine) => {
  const mixer = createMixer(engine.context, engine.buffers);
  engine.mixer = mixer
}


export default createAudioEngine;
