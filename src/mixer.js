const createMixer = context => {
  const master = context.createGain();
  master.gain.value = 0.8;
  master.connect(context.destination);

  const drumloopGain = context.createGain();
  drumloopGain.connect(master);
  const subGain = context.createGain();
  subGain.connect(master);

  return {
    master,
    tracks: {
      drumloop: {gain: drumloopGain},
      sub: {gain: subGain},
    }
  };
};

export default createMixer;
