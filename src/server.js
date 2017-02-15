'use strict';

import express from 'express';
import alexa from 'alexa-app';
import config from 'easy-config';
import skills from './skills';
import { generateAmazonConfig } from './scripts/generateAmazonConfig';

const express_app = express();
const app = new alexa.app('alexa');

if (Array.isArray(skills)) {
  skills.forEach((skill) => {
    skill.endpoints.forEach((endpoint) => {
      app.intent(
        endpoint.intent,
        {
          slots: endpoint.slots,
          utterances: endpoint.utterances
        },
        (req, res, next) => {
          endpoint.response(req, res, next);
        }
      );
    });
  });
} else {
  throw new Error('Skills array missing');
}

// Error handling
app.error = function(exception, request, response) {
  response.say('You talking to me?');
};

// setup the alexa app and attach it to express before anything else
app.express({ expressApp: express_app, router: express.Router() });
express_app.listen(config.server.port, config.server.host);
console.log(`Listening to port ${config.server.port}...`);  // eslint-disable-line no-console

generateAmazonConfig(true, true);