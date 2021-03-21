import * as R from 'ramda';
import catalog from './catalog';

const mapIndexed = R.addIndex(R.map);

const indexToTime = (spec, index) => {
  const oneBeat = 60.0 / spec.bpm;
  const amountBeats = spec.bars * 4;
  const amountEights = amountBeats * 2;
  const sampleLenSecs = oneBeat * amountBeats;
  const sliceLen = sampleLenSecs / amountEights;
  return index * sliceLen;
};

const generateHitMap = sampleName => {
  const spec = catalog[sampleName];
  return R.pipe(
    mapIndexed((v, k) => ({index: k, hit: v, time: indexToTime(spec, k)})),
    R.reject(R.propEq('hit', 0)),
  )(spec.hits.split(''));
};

export default generateHitMap;
