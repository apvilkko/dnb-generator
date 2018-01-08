import {observable, action} from 'mobx';

const store = observable({
  tempo: null,
  currentIndex: 0,
  pattern: {
    drumloop: [],
    sub: [],
  }
});

store.setTempo = action(tempo => {
  store.tempo = tempo;
});

store.setCurrentIndex = action(i => {
  store.currentIndex = i;
});

store.setPattern = action(pattern => {
  store.pattern = pattern;
});

export default store;
