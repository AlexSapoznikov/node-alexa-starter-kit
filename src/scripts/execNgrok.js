'use strict';
/**
 * Exposes localhost to the internet
 */

import ngrok from 'ngrok';
import config from 'easy-config';

ngrok.connect(config.server.port, (err, url, webInterface) => {
  if (err) {
    throw new err;
  }

  const logRepsonse = [];

  logRepsonse.push(`\n-------------------------------------------`);
  logRepsonse.push(`Status: online`);
  logRepsonse.push(`Forwarding: ${url} -> http://${config.server.host}:${config.server.port}`);
  logRepsonse.push(`Web Interface: ${webInterface}`);
  logRepsonse.push(`Endpoint for Alexa: ${url}/${config.server.accessEndpoint}`);
  logRepsonse.push(`-------------------------------------------\n`);
  // eslint-disable-next-line
  console.log(logRepsonse.join('\n'));
});