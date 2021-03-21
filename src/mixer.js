import { reverb } from "./reverb";
import { delay } from "./delay";
import { waveshaper } from "./waveshaper";

const createMixer = (context, buffers) => {
  const master = context.createGain();
  master.gain.value = 0.8;
  master.connect(context.destination);
  const trackDest = master

  const buffer = buffers.impulse1

  const tracks = {};
  ['drumloop', 'drumloop2', 'sub', 'fx', 'stab'].forEach(t => {
    const g = context.createGain();
    let dest = trackDest
    if (t === 'fx' || t === 'stab') {
      const del = delay(context, {gain: 0.4})
      const rev = reverb(context, {buffer})
      del.output.connect(rev.input)
      rev.output.connect(trackDest)
      g.connect(rev.input)
      dest = del.input
    } else if (t.startsWith('drumloop') || t === 'sub') {
      const ws = waveshaper(context)
      ws.output.connect(trackDest)
      dest = ws.input
    }
    g.connect(dest);
    tracks[t] = {gain: g}
  });

  return {
    master,
    tracks
  };
};

export default createMixer;
