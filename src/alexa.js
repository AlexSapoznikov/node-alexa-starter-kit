'use strict';
import express from 'express';
import alexa from 'alexa-app';

const express_app = express();

const app = new alexa.app("alexa");

app.intent("test", {
    "slots": { "number": "AMAZON.NUMBER" },
    "utterances": ["say the number {-|number}", "repeat the number {-|number}"]
  },
  function(request, response) {
    const number = request.slot("number");
    response.say("You asked for the number " + number);
  }
);

// setup the alexa app and attach it to express before anything else
app.express({ expressApp: express_app, router: express.Router() });

express_app.listen(3000);

// now POST calls to /alexa in express will be handled by the app.request() function
// GET calls will not be handled

// from here on, you can setup any other express routes or middleware as normal