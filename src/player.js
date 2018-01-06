const playSample = (ctx, note, track) => {
  const node = ctx.context.createBufferSource();
  node.buffer = ctx.buffers[ctx.scene.samples[track]];
  node.connect(ctx.mixer.tracks[track].gain);
  // console.log('playSample', note, track);
  node.playbackRate.value = ctx.scene.playbackRate;
  node.start(0, note);
  return node;
};

export default playSample;
