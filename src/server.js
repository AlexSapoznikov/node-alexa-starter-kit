'use strict';

import express from 'express';
import alexa from 'alexa-app';
import config from 'easy-config';
import mergeSkills from './skills';
import { generateAmazonConfig } from './scripts/generateAmazonConfig';

export const express_app = express();
const app = new alexa.app(config.server.accessEndpoint);

mergeSkills()
  .then((skills) => {
    skills.forEach((skill) => {
      skill.intents.forEach((endpoint) => {
        app.intent(
          endpoint.intentName,
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
    return skills;
  })
  .then((skills) => {
    // Error handling
    app.error = function(exception, request, response) {
      response.say('You talking to me?');
    };

    // setup the alexa app and attach it to express before anything else
    app.express({ expressApp: express_app, router: express.Router() });
    express_app.listen(config.server.port, config.server.host, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening to port ${config.server.port}...`);
    });

    generateAmazonConfig(skills, true, true);
  })
  .catch((err) => {
    throw new Error(err);
  });