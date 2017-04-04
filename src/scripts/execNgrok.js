'use strict';
/**
 * Exposes localhost to the internet
 */

import ngrok from 'ngrok';
import config from 'easy-config';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';
import { resolve } from 'path';
import urlJoin from 'url-join';

function saveToFile (url, webInterface) {
  const saveLocation = resolve('data');

  mkdirp(saveLocation, () => {
    const exposeFileLocation = urlJoin(saveLocation, `exposed.json`);
    const saveData = {
      interfaceUrl: webInterface,
      exposedUrl: `${url}/${config.server.accessEndpoint}`
    };

    writeFile(exposeFileLocation, JSON.stringify(saveData, null, 2), { flag: 'w' }, (err) => {
      if (err) {
        console.log(`Could not write expose file to ${exposeFileLocation}`, err); // eslint-disable-line
        return;
      }
      console.log(`Expose file written to ${exposeFileLocation}`); // eslint-disable-line
      console.log(`Configuration is now accessible in ${url}/config`); // eslint-disable-line
    });
  });
}

ngrok.connect(config.server.port, (err, url, webInterface) => {
  if (err) {
    throw err;
  }

  const logRepsonse = [];

  logRepsonse.push(`\n-------------------------------------------`);
  logRepsonse.push(`Status: online`);
  logRepsonse.push(`Forwarding: ${url} -> http://${config.server.host}:${config.server.port}`);
  logRepsonse.push(`Web Interface: ${webInterface}`);
  logRepsonse.push(`Endpoint for Alexa: ${url}/${config.server.accessEndpoint}`);
  logRepsonse.push(`-------------------------------------------\n`);

  const data = logRepsonse.join('\n');
  saveToFile(url, webInterface);
  console.log(data);  // eslint-disable-line
});