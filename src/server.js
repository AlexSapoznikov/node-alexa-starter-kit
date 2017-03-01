'use strict';

import express from 'express';
import alexa from 'alexa-app';
import config from 'easy-config';
import errorMessages from './errorMessages';
import mergeSkills from './skills';
import { generateAmazonConfig } from './scripts/generateAmazonConfig';

const express_app = express();
export const app = new alexa.app(config.server.accessEndpoint);
app.writeConfigToConsole = true;
app.persistentSession = true; // persist every request session attribute into the response

mergeSkills(config.server.skillsLocation)
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
            return endpoint.response(req, res, next);
          }
        );
      });
    });
    return skills;
  })
  .then((skills) => {
    // setup the alexa app and attach it to express
    app.express({ expressApp: express_app, router: express.Router() });

    // Launch, open command
    app.launch((request, response) => {
      response.say('Launched');
    });

    // Executed before any event handlers
    app.pre = (request, response, type) => {
      // Code that runs before any event handles, for example session validation
      const session = request.getSession();
      const sessionId = session.details.sessionId;
    };

    // The last thing executed for every request
    app.post = (request, response, type, exception) => {
      if (exception) {
        // always turn an exception into a successful response
        const errorMessage = errorMessages[exception] || app.messages[exception];
        response.clear().say(errorMessage).send();
      }
    };

    // Session end
    app.sessionEnded((request, response) => {
      // Session end code, no response required
    });

    // Error handling
    app.error = (exception, request, response) => {
      response.say('An error occured');
    };

    express_app.listen(config.server.port, config.server.host, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening to port ${config.server.port}...`);
    });

    if (express_app.settings.env !== 'test') {
      generateAmazonConfig(skills, app.writeConfigToConsole, true);
    }
  })
  .catch((err) => {
    throw new Error(`Could not find/merge skills: ${err}`);
  });