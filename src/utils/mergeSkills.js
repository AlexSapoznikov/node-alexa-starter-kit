'use strict';
/**
 * Automatically loads all valid skills from src/skills folder and merges them into array
 */

import { readdir } from 'fs';
import cloneDeep from 'lodash/cloneDeep';
import { resolve as resolvePath } from 'path';
import urlJoin from 'url-join';

const parentFolder = resolvePath(__dirname, '..');

export default function mergeSkills(skillsLocation) {
  return getSkills(skillsLocation)
    .then((skills) => {
      return concatSkills(skills);
    });
}

export function concatSkills(skillsArr) {
  const mergedSkills = [];

  skillsArr.forEach((skill) => {
    if (skillIsValid(skill, skill.fileName)) {

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

  return mergedSkills;
}

export function getSkills (skillsLocation) {
  return new Promise((resolve, reject) => {
    const skills = [];
    const pathToSkills = urlJoin(parentFolder, skillsLocation);

    readdir(pathToSkills, (err, files) => {
      if (err || !files || !files.length) {
        reject(`Could not read skills from ${pathToSkills}`);
        return;
      }

      files.forEach((file) => {
        const skillFile = cloneDeep(require(urlJoin(pathToSkills, file)));

        Object.keys(skillFile).forEach((importedSkill) => {
          const skill = skillFile[importedSkill];
          skill.fileName = file;
          skills.push(skill);
        });
      });

      resolve(skills);
    });
  });
}

export function skillIsValid (skill, file) {
  const correctStructure = skill && typeof skill === 'object' && !Array.isArray(skill);
  const namesExists = skill && skill.skillName && skill.skillName !== '';
  const correctIntents = skill && skill.intents && Array.isArray(skill.intents);
  const duplicatedIntents = skill && correctIntents && skillHasDuplicateIntents(skill);

  const isValid = (
    correctStructure &&
    namesExists &&
    correctIntents &&
    !duplicatedIntents
  );

  const errors = [];
  if (correctIntents && duplicatedIntents) {
    errors.push(` - Duplicated intents found`); // eslint-disable-line no-console
  }
  if (!correctStructure) {
    errors.push(` - Incorrect object exported`);  // eslint-disable-line no-console
  }
  if (!namesExists) {
    errors.push(` - Skill name does not exist`);  // eslint-disable-line no-console
  }
  if (!correctIntents) {
    errors.push(` - Incorrect array of intent objects`);  // eslint-disable-line no-console
  }

  if (!isValid && process.env.NODE_ENV !== 'test') {
    const filePath = file ? `./skills/${file}` : '';
    console.log(`\nINVALID skill file ${filePath} (not included)\n${errors.join('\n')}\n`); // eslint-disable-line no-console
  }

  return isValid;
}

export function skillHasDuplicateIntents(skill) {
  return skill.intents.some((intent1, i1) => {
    return skill.intents.some((intent2, i2) => {
      return intent1.intentName === intent2.intentName && i1 !== i2;
    });
  });
}

export function mergeIntents(mergedSkill, duplicatedSkill) {
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