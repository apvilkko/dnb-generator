const fs = require('fs');
const path = require('path');
const config = require('./locals');
const exec = require('child_process').exec;

const files = fs.readdirSync(config.samplePath);

files.forEach(filename => {
  const fullname = path.join(config.samplePath, filename);
  const outname = path.join('./public/samples', `${filename.split('.')[0]}.ogg`);
  const ffmpeg = path.join(config.ffmpegPath, 'ffmpeg.exe');
  const cmd = `${ffmpeg} -i ${fullname} -codec:a libvorbis ${outname}`;
  exec(cmd, error => {
    if (error) {
      console.error(error);
    }
    console.log(filename);
  });
});
