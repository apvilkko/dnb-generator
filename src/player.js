const getRateFromPitch = pitch => Math.pow(2, (pitch * 100) / 1200);

const playSample = (ctx, note, track, delta = 0) => {
  const node = ctx.context.createBufferSource();
  node.buffer = ctx.buffers[ctx.scene.samples[track]];
  node.connect(ctx.mixer.tracks[track].gain);
  // console.log('playSample', note, track);
  if (note && note.hasOwnProperty('pitch')) {
    node.playbackRate.value = getRateFromPitch(note.pitch);
  } else {
    node.playbackRate.value = ctx.scene.playbackRate;
  }
  const offset = (note && note.time) ? note.time : 0;
  node.start(ctx.context.currentTime + delta, offset);
  return node;
};

export default playSample;
