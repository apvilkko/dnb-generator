import playSample from './player';

const playing = true;
const scheduleAheadTime = 0.1;
const noteLen = 0.25;
const seqLength = 256;

let previousNode;

const scheduleNote = ctx => {
  const currentNote = ctx.sequencer.currentNote;
  ctx.scene.store.setCurrentIndex(currentNote);
  const pattern = ctx.scene.pattern;
  const note = pattern[currentNote % pattern.length];

  if (note !== null) {
    if (previousNode) {
      previousNode.stop();
    }
    previousNode = playSample(ctx, note, Object.keys(ctx.scene.samples)[0]);
  }
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
