const createMixer = context => {
  const master = context.createGain();
  master.connect(context.destination);

  const drumloopGain = context.createGain();
  drumloopGain.connect(master);

  return {
    master,
    tracks: {
      drumloop: {
        gain: drumloopGain
      }
    }
  };
};

export default createMixer;
