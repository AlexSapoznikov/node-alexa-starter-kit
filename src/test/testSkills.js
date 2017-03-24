import assert from 'assert';
import { concatSkills, getSkills, skillIsValid, skillHasDuplicateIntents} from '../utils/mergeSkills';
import { skillsEqual } from './helpers';

const test1Data = {
  skillName: 'testSkill1',
  intents: [
    {
      intentName: 'testSkill1-testIntent1',
      slots: {
        date: 'AMAZON.DATE'
      },
      utterances: [
        'testSkill1-testutterances1',
      ],
      response: () => {
        return 'testSkill1-response1';
      }
    }
  ]
};

const test2Data = {
  skillName: 'testSkill1',
  intents: [
    {
      intentName: 'testSkill1-testIntent2',
      slots: {
        number: 'AMAZON.NUMBER'
      },
      utterances: [
        'testSkill1-testutterances2',
        'testSkill1-testutterances3',
      ],
      response: () => {
        return 'testSkill1-response2';
      }
    },
    {
      intentName: 'testSkill1-testIntent3',
      slots: null,
      utterances: [
        'testSkill1-testutterances4',
      ],
      response: () => {
        return 'testSkill1-response3';
      }
    }
  ]
};

const test3Data = {
  skillName: 'testSkill2',
  intents: [
    {
      intentName: 'testSkill2-testIntent1',
      slots: null,
      utterances: [
        'testSkill2-testutterances1'
      ],
      response: () => {
        return 'testSkill2-response1';
      }
    }
  ]
};

describe('Merging skills:', () => {
  describe('concatSkills()', () => {
    it('Should merge intents of skills with the same name', () => {
      const mergedSkills = concatSkills([test1Data, test2Data]);

      const expected = [
        {
          skillName: 'testSkill1',
          intents: [
            {
              intentName: 'testSkill1-testIntent1',
              slots: {
                date: 'AMAZON.DATE'
              },
              utterances: [
                'testSkill1-testutterances1',
              ],
              response: () => {
                return 'testSkill1-response1';
              }
            },
            {
              intentName: 'testSkill1-testIntent2',
              slots: {
                number: 'AMAZON.NUMBER'
              },
              utterances: [
                'testSkill1-testutterances2',
                'testSkill1-testutterances3',
              ],
              response: () => {
                return 'testSkill1-response2';
              }
            },
            {
              intentName: 'testSkill1-testIntent3',
              slots: null,
              utterances: [
                'testSkill1-testutterances4',
              ],
              response: () => {
                return 'testSkill1-response3';
              }
            }
          ]
        }
      ];

      skillsEqual(mergedSkills, expected);
    });

    it('Should not merge intents of skills with different skillNames', () => {
      const mergedSkills = concatSkills([test1Data, test3Data]);

      const expected = [
        {
          skillName: 'testSkill1',
          intents: [
            {
              intentName: 'testSkill1-testIntent1',
              slots: {
                date: 'AMAZON.DATE'
              },
              utterances: [
                'testSkill1-testutterances1',
              ],
              response: () => {
                return 'testSkill1-response1';
              }
            }
          ]
        },
        {
          skillName: 'testSkill2',
          intents: [
            {
              intentName: 'testSkill2-testIntent1',
              slots: null,
              utterances: [
                'testSkill2-testutterances1'
              ],
              response: () => {
                return 'testSkill2-response1';
              }
            }
          ]
        }
      ];

      skillsEqual(mergedSkills, expected);
    });

    it('Should merge intents of skills with same name and store skills with different name separately', () => {
      const mergedSkills = concatSkills([test1Data, test2Data, test3Data]);

      const expected = [
        {
          skillName: 'testSkill1',
          intents: [
            {
              intentName: 'testSkill1-testIntent1',
              slots: {
                date: 'AMAZON.DATE'
              },
              utterances: [
                'testSkill1-testutterances1',
              ],
              response: () => {
                return 'testSkill1-response1';
              }
            },
            {
              intentName: 'testSkill1-testIntent2',
              slots: {
                number: 'AMAZON.NUMBER'
              },
              utterances: [
                'testSkill1-testutterances2',
                'testSkill1-testutterances3',
              ],
              response: () => {
                return 'testSkill1-response2';
              }
            },
            {
              intentName: 'testSkill1-testIntent3',
              slots: null,
              utterances: [
                'testSkill1-testutterances4',
              ],
              response: () => {
                return 'testSkill1-response3';
              }
            }
          ]
        },
        {
          skillName: 'testSkill2',
          intents: [
            {
              intentName: 'testSkill2-testIntent1',
              slots: null,
              utterances: [
                'testSkill2-testutterances1'
              ],
              response: () => {
                return 'testSkill2-response1';
              }
            }
          ]
        }
      ];

      skillsEqual(mergedSkills, expected);
    });

    it('Should remove duplicates', () => {
      const mergedSkills = concatSkills([test3Data, test3Data]);

      const expected = [
        {
          skillName: 'testSkill2',
          intents: [
            {
              intentName: 'testSkill2-testIntent1',
              slots: null,
              utterances: [
                'testSkill2-testutterances1'
              ],
              response: () => {
                return 'testSkill2-response1';
              }
            }
          ]
        }
      ];
      skillsEqual(mergedSkills, expected);
    });
  });

  describe('skillHasDuplicateIntents()', () => {
    it('Skill should not have duplicate intents', () => {
      const duplicatedIntents = {
        skillName: 'testSkill2',
        intents: [
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          },
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          }
        ]
      };
      // Should catch duplicated intents
      assert.ok(skillHasDuplicateIntents(duplicatedIntents));

      duplicatedIntents.intents = [duplicatedIntents.intents[0]];
      // Should pass, because no duplicated intents
      assert.ok(!skillHasDuplicateIntents(duplicatedIntents));
    });
  });

  describe('skillIsValid()', () => {
    it('Skills should be valid', () => {
      assert.ok(skillIsValid(test1Data, 'test1Data'));
      assert.ok(skillIsValid(test2Data, 'test2Data'));
      assert.ok(skillIsValid(test3Data, 'test3Data'));
    });
    it('Skill as string should be invalid', () => {
      const skillAsString = 'string';
      assert.ok(!skillIsValid(skillAsString));
    });

    it('Skill as number should be invalid', () => {
      const skillAsNumber = 1;
      assert.ok(!skillIsValid(skillAsNumber));
    });
    it('Skill as array should be invalid', () => {
      const skillAsArray = [{
        skillName: 'testSkill2',
        intents: [
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          }
        ]
      }];
      assert.ok(!skillIsValid(skillAsArray));
    });
    it('Skill without name should be invalid', () => {
      const skillWithoutName = {
        skillName: '',
        intents: [
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          }
        ]
      };
      assert.ok(!skillIsValid(skillWithoutName));
    });
    it('Skill with intents that are not in array should be invalid', () => {
      const intentsNotArray = {
        intentName: 'testSkill2-testIntent1',
        slots: null,
        utterances: [
          'testSkill2-testutterances1'
        ],
        response: () => {
          return 'testSkill2-response1';
        }
      };
      assert.ok(!skillIsValid(intentsNotArray));
    });
    it('Skill with duplicated intents should be invalid', () => {
      const duplicatedIntents = {
        skillName: 'testSkill2',
        intents: [
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          },
          {
            intentName: 'testSkill2-testIntent1',
            slots: null,
            utterances: [
              'testSkill2-testutterances1'
            ],
            response: () => {
              return 'testSkill2-response1';
            }
          }
        ]
      };
      assert.ok(!skillIsValid(duplicatedIntents));
    });
  });
});