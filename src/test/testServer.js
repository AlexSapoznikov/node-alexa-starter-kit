import { app } from '../server';
import assert from 'assert';
import { formatRequest } from './helpers';

describe('Server', () => {
  it('dogNumber should respond', (done) => {
    const request = formatRequest('dogNumber', {
      number: {
        name: 'number',
        value: '1'
      }
    });

    app.request(request)
      .then((responseData) => {
        const response = responseData.response.outputSpeech;
        assert.equal(response.type, 'SSML');
        assert.equal(response.ssml, '<speak>The number you asked to say is 1</speak>');
        done();
      });
  });

  it('dogFood should respond', (done) => {
    const request = formatRequest('dogFood');

    app.request(request)
      .then((responseData) => {
        const response = responseData.response.outputSpeech;
        assert.equal(response.type, 'SSML');
        assert.equal(response.ssml, '<speak>Yes, much food, such wow</speak>');
        done();
      });
  });

  it('dogDate should respond', (done) => {
    const request = formatRequest('dogDate', {
      date: {
        date: 'date',
        value: '2017-02-23'
      }
    });

    app.request(request)
      .then((responseData) => {
        const response = responseData.response.outputSpeech;
        assert.equal(response.type, 'SSML');
        assert.equal(response.ssml, '<speak>2017-02-23</speak>');
        done();
      });
  });

  it('askanyone should respond', (done) => {
    const request = formatRequest('askanyone');

    app.request(request)
      .then((responseData) => {
        const response = responseData.response.outputSpeech;
        assert.equal(response.type, 'SSML');
        assert.equal(response.ssml, '<speak>Where is everybody?</speak>');
        done();
      });
  });
});