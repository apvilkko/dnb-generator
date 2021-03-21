export const reverb = (ctx, {buffer, dry = 0.8, wet = 0.5}) => {
  const reverb = ctx.createConvolver();
  const output = ctx.createGain();
  const input = ctx.createGain();
  const dryNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.frequency.value = 100;
  filter.type = 'highpass';
  dryNode.gain.value = dry;
  const wetNode = ctx.createGain();
  wetNode.gain.value = wet;
  input.connect(dryNode);
  dryNode.connect(output);
  input.connect(filter);
  filter.connect(reverb);
  reverb.connect(wetNode);
  wetNode.connect(output);
  reverb.buffer = buffer;

  return {
    input,
    output,
  };
};