'use strict';

export default {
  skillName: 'dog',
  invocationName: 'dog',
  intents: [
    {
      intentName: 'dogNumber',
      slots: {
        number: 'AMAZON.NUMBER'
      },
      utterances: [
        'say the number {-|number}',
        'find {-|number}'
      ],
      response: (request, response) => {
        const number = request.slot('number');
        response.say(`The number you asked to say is ${number}`);
      }
    },
    {
      intentName: 'dogForgivness',
      slots: null,
      utterances: [
        'forgivness',
        '{forgive|forgives}'
      ],
      response: (request, response) => {
        const random = function () {
          return Math.round(Math.random());
        };

        let answer = '';
        if (random() === 0) {
          answer = 'No, the dog does not forgive';

          if (random() === 0) {
            answer += ', unless you give food';
          } else {
            answer += ', You can ask again though';
          }
        } else {
          answer = `The dog forgives`;

          if (random() === 0) {
            answer += ', Maybe';
          }
        }

        response.say(answer);
      }
    }
  ]
};