'use strict';

export default {
  skillName: 'anyone',
  intents: [
    {
      intentName: 'askanyone',
      slots: null,
      utterances: [
        'if'
      ],
      response: (request, response) => {
        response.say('Where is everybody?');
      }
    }
  ]
};