const getRateFromPitch = pitch => Math.pow(2, (pitch * 100) / 1200);

const playSample = (ctx, note, track, delta = 0) => {
  const node = ctx.context.createBufferSource();
  const sampleSpec = ctx.scene.samples[track]
  node.buffer = ctx.buffers[sampleSpec.name];
  const destGain = ctx.mixer.tracks[track].gain
  destGain.gain.value = sampleSpec.gain
  node.connect(destGain);
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
