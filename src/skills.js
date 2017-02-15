'use strict';

export default [
  {
    skillName: 'test',
    invocationName: 'test',
    endpoints: [
      {
        intent: 'test',
        slots: {
          number: 'AMAZON.NUMBER'
        },
        utterances: [
          'say the number {-|number}',
          'repeat the number {-|number}'
        ],
        response: (request, response) => {
          const number = request.slot('number');
          response.say(`Hey my love, the number you asked to say is ${number}`);
        }
      }
    ]
  },

  {
    skillName: 'yourself',
    invocationName: 'yourself',
    endpoints: [
      {
        intent: 'yourself',
        slots: {
          number: 'AMAZON.NUMBER'
        },
        utterances: [
          'say the number {-|number}',
          'repeat the number {-|number}'
        ],
        response: (request, response) => {
          const number = request.slot('number');
          response.say(`Alexa, say the number ${number}`);
        }
      }
    ]
  }
];