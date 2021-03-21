import playSample from './player';

let playing = true;
const noteLen = 0.25;
const seqLength = 256;

let previousNodes = {};

const WORKER_TICK_LEN = 0.2;

const TRACKS = ['drumloop', 'drumloop2', 'sub', 'fx', 'stab'];

const scheduleNote = (ctx, delta = 0) => {
  const currentNote = ctx.sequencer.currentNote;
  const pattern = ctx.scene.pattern;

  TRACKS.forEach(track => {
    const note = pattern[track][currentNote % pattern[track].length];

    if (note !== null) {
      if (previousNodes[track]) {
        previousNodes[track].stop(ctx.context.currentTime + delta);
      }
      previousNodes[track] = playSample(ctx, note, track, delta);
    }
  });
};

export const togglePlay = state => {
  if (typeof state === 'boolean') {
    playing = state
  } else {
    playing = !playing
  }
}

const nextNote = ctx => {
  const currentNote = ctx.sequencer.currentNote;
  const nextNote = currentNote === (seqLength - 1) ? -1 : currentNote;
  ctx.sequencer.currentNote = nextNote + 1;
};

const getNextNoteTime = (ctx, time) => {
  const tempo = ctx.scene.tempo;
  const beatLen = 60.0 / tempo;
  const current16th = Math.floor(time / (noteLen * beatLen));
  return (current16th + 1) * (noteLen * beatLen);
};

const SAFETY_OFFSET = 0.010;

export const tick = ctx => {
  const currentTime = ctx.context.currentTime;
  if (playing) {
    let time = ctx.sequencer.lastTickTime;
    const nextNotes = [];
    let nextNoteTime;
    do {
      nextNoteTime = getNextNoteTime(ctx, time);
      if (nextNoteTime < currentTime) {
        nextNotes.push(nextNoteTime);
      }
      time += (nextNoteTime - time + 0.005);
    } while (nextNoteTime < currentTime);
    for (let i = 0; i < nextNotes.length; ++i) {
      const delta = Math.max(nextNotes[i] - (currentTime - WORKER_TICK_LEN) + SAFETY_OFFSET, 0);
      scheduleNote(ctx, delta);
      const currentNote = ctx.sequencer.currentNote;
      setTimeout(() => {
        ctx.scene.store.setCurrentIndex(currentNote);
      }, delta);
      nextNote(ctx);

    }
  }
  ctx.sequencer.lastTickTime = currentTime;
};
