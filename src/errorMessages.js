export default {
  // when an intent was passed in that the application was not configured to handle
  NO_INTENT_FOUND: 'Sorry, the application didn\'t know what to do with that intent',

  // when an AudioPlayer event was passed in that the application was not configured to handle
  NO_AUDIO_PLAYER_EVENT_HANDLER_FOUND: 'Sorry, the application didn\'t know what to do with that AudioPlayer event',

  // when the app was used with 'open' or 'launch' but no launch handler was defined
  NO_LAUNCH_FUNCTION: 'Try telling the application what to do instead of opening it',

  // when a request type was not recognized
  INVALID_REQUEST_TYPE: 'Error: not a valid request',

  // when a request and response don't contain session object
  // https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#request-body-parameters
  NO_SESSION: 'This request doesn\'t support session attributes',

  // if some other exception happens
  GENERIC_ERROR: 'Sorry, the application encountered an error'
};