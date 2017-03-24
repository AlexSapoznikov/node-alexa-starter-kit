'use strict';

export default {
  skillName: 'dog',
  intents: [
    {
      intentName: 'dogDate',
      slots: {
        date: 'AMAZON.DATE'
      },
      utterances: [
        '{-|date}'
      ],
      response: (request, response) => {
        const date = request.slot('date');
        response.say(date);
      }
    }
  ]
};