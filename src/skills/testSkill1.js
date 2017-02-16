'use strict';
console.log('asd');
export default {
  skillName: 'god',
  invocationName: 'god',
  intents: [
    {
      intentName: 'godNumber',
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
      intentName: 'godForgivness',
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
          answer = 'No, he does not forgive';

          if (random() === 0) {
            answer += ', You will all go to hell';
          } else {
            answer += ', You can ask again though';
          }
        } else {
          answer = `He forgives`;

          if (random() === 0) {
            answer += ', Maybe';
          }
        }

        response.say(answer);
      }
    }
  ]
};