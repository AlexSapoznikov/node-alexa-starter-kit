'use strict';
/**
 * Creates new sample skill js file by copying sampleSkill from data folder
 */

import fs, {writeFile} from 'fs';

// Creates new empty skill file

// Default name
let name = `new-skill-${new Date().getTime()}`;

// Find if name argument passed
process.argv.some((arg) => {
  if (arg.startsWith('--name')) {
    const splittedArg = arg.split('=');
    if (splittedArg.length > 1) {
      name = splittedArg[1];
      return true;
    }
  }
});

// Create name
const fileName = `src/skills/${name}.js`;

const read = fs.createReadStream('./data/sampleSkill');
const write = fs.createWriteStream(fileName, {flags: 'wx'});

write.on('error', (err) => {
  if (err.code === 'EEXIST') {
    // eslint-disable-next-line no-console
    console.log(`\nERROR: ${fileName} already exists.\n`);
    return;
  }
  throw err;
});

write.on('close', () => {
  // eslint-disable-next-line no-console
  console.log(`\nSUCCESS: ${fileName} created.\n`);
});

read.pipe(write);