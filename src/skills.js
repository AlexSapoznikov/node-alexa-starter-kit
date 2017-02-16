'use strict';

export default [
  {
    skillName: 'god',
    invocationName: 'god',
    endpoints: [
      {
        intent: 'one',
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
      },
      {
        intent: 'two',
        slots: {
        },
        utterances: [
          'likes yoga'
        ],
        response: (request, response) => {
          response.say(`yoga end-aly yalaga nak-ku`);
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