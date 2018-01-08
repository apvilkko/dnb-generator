import playSample from './player';

const playing = true;
const scheduleAheadTime = 0.1;
const noteLen = 0.25;
const seqLength = 256;

let previousNodes = {};

const TRACKS = ['drumloop', 'sub'];

const scheduleNote = ctx => {
  const currentNote = ctx.sequencer.currentNote;
  ctx.scene.store.setCurrentIndex(currentNote);
  const pattern = ctx.scene.pattern;

  TRACKS.forEach(track => {
    const note = pattern[track][currentNote % pattern[track].length];

    if (note !== null) {
      if (previousNodes[track]) {
        previousNodes[track].stop();
      }
      previousNodes[track] = playSample(ctx, note, track);
    }
  });
};

const nextNote = ctx => {
  const tempo = ctx.scene.tempo;
  const currentNote = ctx.sequencer.currentNote;
  const nextNoteTime = ctx.sequencer.nextNoteTime;
  const nextNote = currentNote === (seqLength - 1) ? -1 : currentNote;
  ctx.sequencer.nextNoteTime = nextNoteTime + (noteLen * (60.0 / tempo));
  ctx.sequencer.currentNote = nextNote + 1;
};

export const tick = ctx => {
  if (playing) {
    if (ctx.sequencer.nextNoteTime < ctx.context.currentTime + scheduleAheadTime) {
      scheduleNote(ctx);
      nextNote(ctx);
    }
  }
};
