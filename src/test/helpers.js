import assert from 'assert';

module.exports = {
  skillsEqual,
  formatRequest
};

/**
 * Asserts if skills equal to each other
 * @param response
 * @param expected
 */
function skillsEqual (response, expected) {
  // Check length
  assert.equal(response.length, expected.length);

  // Check values
  expected.forEach((expectedSkill, skillIndex) => {
    const responseSkill = response[skillIndex];

    // Check skill name
    assert.equal(expectedSkill.skillName, responseSkill.skillName);

    // Check intents
    expectedSkill.intents.forEach((expectedIntent, intentIndex) => {
      const responseIntent = responseSkill.intents[intentIndex];

      // Check intent name
      assert.equal(expectedIntent.intentName, responseIntent.intentName);

      // Check response
      assert.equal(expectedIntent.response(), responseIntent.response());

      // Check slots
      if (expectedIntent.slots) {
        Object.keys(expectedIntent.slots).forEach((expectedSlotKey) => {
          const responseSlot = responseIntent.slots[expectedSlotKey];
          const expectedSlot = expectedIntent.slots[expectedSlotKey];

          // Check each slot value
          assert.equal(responseSlot, expectedSlot);
        });
      }

      // Check utterances
      if (expectedIntent.utterances) {
        expectedIntent.utterances.forEach((expectedUtterance, utteranceIndex) => {
          const responseUtterance = responseIntent.utterances[utteranceIndex];

          // Check each utterance
          assert.equal(responseUtterance, expectedUtterance);
        });
      }
    });
  });
}

/**
 * Formats intentName and slots into request
 * @param intentName
 * @param requestType
 * @param slots
 * @returns object
 */
function formatRequest(intentName, slots, requestType = 'IntentRequest') {
  return {
    'session': {
      'sessionId': 'mysession',
      'application': {
        'applicationId': 'amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe'
      },
      'attributes': {},
      'user': {
        'userId': 'amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2'
      },
      'new': true
    },
    'request': {
      'type': requestType,
      'requestId': 'amzn1.echo-api.request.6919844a-733e-4e89-893a-fdcb77e2ef0d',
      'locale': 'en-US',
      'timestamp': '2016-02-22T09:44:55Z',
      'intent': {
        'name': intentName,
        'slots': slots
      }
    },
    'version': '1.0'
  };
}