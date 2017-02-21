import assert from 'assert';

module.exports = {
  skillsEqual
};

export function skillsEqual (response, expected) {
  // Check length
  assert.equal(response.length, expected.length);

  // Check values
  expected.forEach((expectedSkill, skillIndex) => {
    const responseSkill = response[skillIndex];

    // Check skill name
    assert.equal(expectedSkill.skillName, responseSkill.skillName);

    // Check invocation name
    assert.equal(expectedSkill.invocationName, responseSkill.invocationName);

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