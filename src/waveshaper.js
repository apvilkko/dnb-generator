const makeDistortionCurve = amount => {
  const k = amount;
  // const nSamples = 32768;
  const nSamples = 4096;
  const curve = new Float32Array(nSamples);
  // const deg = Math.PI / 180;
  let x;
  for (let i = 0; i < nSamples; ++i) {
    x = i * 2 / nSamples - 1;
    curve[i] = Math.tanh(k * Math.sin(x));
  }
  return curve;
};

export const waveshaper = ctx => {
  const shaper = ctx.createWaveShaper();
  shaper.curve = makeDistortionCurve(32);
  shaper.oversample = '4x';
  const output = ctx.createGain();
  const input = ctx.createGain();
  const dry = ctx.createGain();
  dry.gain.value = 0.2;
  const wet = ctx.createGain();
  wet.gain.value = 0.05;
  input.connect(dry);
  input.connect(wet);
  wet.connect(shaper);
  shaper.connect(output);
  dry.connect(output);

  return {
    output,
    input,
  };
};