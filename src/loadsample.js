const doRequest = url => fetch(url).then(response => response.arrayBuffer());

const getSampleFileName = key => `samples/${key}.ogg`;

const loadSample = (ctx, buffers, name) => new Promise(resolve => {
  if (buffers[name]) {
    resolve();
    return;
  }
  doRequest(getSampleFileName(name)).then(rawBuffer => {
    ctx.decodeAudioData(rawBuffer, buffer => {
      buffers[name] = buffer;
      resolve();
    }, () => {});
  });
});

export default loadSample;
