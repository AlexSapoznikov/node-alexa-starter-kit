'use strict';

export default {
  skillName: 'god',
  invocationName: 'god',
  endpoints: [
    {
      intent: 'godPrediction',
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