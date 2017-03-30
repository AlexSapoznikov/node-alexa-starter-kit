'use strict';

import errorMessages from './errorMessages';

// Launch/Open/Start command
function launch (request, response) {
  response.say('Launched');
}

// Executed before any event handlers
function pre (request, response, type) {
  // Session validation could be done here
  const session = request.getSession();
  const sessionId = session.details.sessionId;
}

// Executed after each request
function post (request, response, type, exception) {
  if (exception) {
    // always turn an exception into a successful response
    const errorMessage = errorMessages[exception] || app.messages[exception];
    response.clear().say(errorMessage).send();
  }
}

// Executed on session end, which happens when:
// - The user says “exit”.
// - The user does not respond or says something that does not match an intent defined in your voice interface while the device is listening for the user’s response.
// - An error occurs.
function sessionEnded (request, response) {
  // Session end code, no response required
}

// Error handling
function error (exception, request, response) {
  response.say('An error occured');
}

module.exports = {
  launch,
  pre,
  post,
  sessionEnded,
  error
};