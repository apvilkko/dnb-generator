import createMixer from './mixer';

const createAudioEngine = () => {
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const mixer = createMixer(context);
  return {
    context,
    mixer,
    buffers: {},
    scene: {
      tempo: 170,
      pattern: [],
    },
    sequencer: {
      currentNote: 0,
      nextNoteTime: context.currentTime,
    },
  }
};

export default createAudioEngine;
