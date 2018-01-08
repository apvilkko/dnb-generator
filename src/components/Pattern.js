import React from 'react';
import {observer} from 'mobx-react';

const Pattern = observer(({store: {pattern, tempo, currentIndex}}) => (
  <div>
    <div>BPM: {tempo}</div>
    <h2>Drum loop pattern</h2>
    <div className="pattern">
      {pattern.drumloop.map((item, i) =>
        <div
          className={`pattern-item${currentIndex % pattern.drumloop.length === i ? ' current' : ''}`}
          key={i}
        >
          {item ? item.index : ''}
        </div>
      )}
    </div>
  </div>
));

export default Pattern;
