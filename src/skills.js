'use strict';
/**
 * Automatically loads all valid skills from src/skills folder
 */

import { readdir } from 'fs';
import cloneDeep from 'lodash/cloneDeep';

export default function mergeSkills() {
  return new Promise((resolve, reject) => {
    // Clean and merge all skills
    const mergedSkills = [];
    let skills = [];

    readdir(`${__dirname}/skills/`, (err, files) => {
      if (err || !files || !files.length) {
        reject('Could not read skills');
      }

      files.forEach((file) => {
        const skill = cloneDeep(require(`./skills/${file}`).default);

        // Find duplicate skill
        let duplicatedSkillIndex = null;
        const duplicatedSkill = mergedSkills.find((mergedSkill, i) => {
          duplicatedSkillIndex = i;
          return mergedSkill.skillName === skill.skillName;
        });

        // Merge endpoints if skill is duplicated

        if (duplicatedSkill) {
          skill.intents.forEach((intent) => {
            mergedSkills[duplicatedSkillIndex].intents.push(intent);
          });
          return;
        }

        // Add new skill to array if not duplicated
        mergedSkills.push(skill);
      });

      resolve(mergedSkills);
    });
  });
}