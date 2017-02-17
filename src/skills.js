'use strict';
/**
 * Automatically loads all valid skills from src/skills folder and merges them into array
 */

import { readdir } from 'fs';
import cloneDeep from 'lodash/cloneDeep';

export default function mergeSkills() {
  return new Promise((resolve, reject) => {
    const mergedSkills = [];
    let skills = [];

    readdir(`${__dirname}/skills/`, (err, files) => {
      if (err || !files || !files.length) {
        reject('Could not read skills');
      }

      files.forEach((file) => {
        const skill = cloneDeep(require(`./skills/${file}`).default);

        if (skillIsValid(skill, file)) {

          // Find duplicate skill
          let duplicatedSkillIndex = null;
          const duplicatedSkill = mergedSkills.find((mergedSkill, i) => {
            duplicatedSkillIndex = i;
            return mergedSkill.skillName === skill.skillName;
          });

          // Merge intents if skill is duplicated
          if (duplicatedSkill) {
            mergedSkills[duplicatedSkillIndex] = mergeIntents(mergedSkills[duplicatedSkillIndex], skill);
            return;
          }

          // Add new skill to array if not duplicated
          mergedSkills.push(skill);
        }
      });

      resolve(mergedSkills);
    });
  });
}

function skillIsValid(skill, file) {
  const correctStructure = typeof skill === 'object' && !Array.isArray(skill);
  const namesExists = skill.skillName && skill.skillName !== '' && skill.invocationName && skill.invocationName !== '';
  const correctIntents = skill.intents && Array.isArray(skill.intents);
  const duplicatedIntents = correctIntents && skillHasDuplicateIntents(skill);

  const isValid = (
    correctStructure &&
    namesExists &&
    correctIntents &&
    !duplicatedIntents
  );

  const errors = [];
  if (correctIntents && duplicatedIntents) {
    errors.push(` - Duplicated intents found`);  // eslint-disable-line no-console
  }
  if (!correctStructure) {
    errors.push(` - Incorrect object exported`);  // eslint-disable-line no-console
  }
  if (!namesExists) {
    errors.push(` - Skill name or invocation name does not exist`);  // eslint-disable-line no-console
  }
  if (!correctIntents) {
    errors.push(` - Incorrect array of intent objects`);  // eslint-disable-line no-console
  }

  if (!isValid) {
    console.log(`\nINVALID skill file: ./skills/${file} (not included)\n${errors.join('\n')}\n`);  // eslint-disable-line no-console
  }

  return isValid;
}
function skillHasDuplicateIntents(skill) {
  return skill.intents.some((intent1, i1) => {
    return skill.intents.some((intent2, i2) => {
      return intent1.intentName === intent2.intentName && i1 !== i2;
    });
  });
}

function mergeIntents(mergedSkill, duplicatedSkill) {
  duplicatedSkill.intents.forEach((duplicatedSkillIntent) => {
    const duplicateIntentsFound = mergedSkill.intents.some((mergedSkillIntent) => {
      return mergedSkillIntent.intentName === duplicatedSkillIntent.intentName;
    });

    if (!duplicateIntentsFound) {
      mergedSkill.intents.push(duplicatedSkillIntent);
    }
  });

  return mergedSkill;
}