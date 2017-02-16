'use strict';

import testSkill1 from './skills/testSkill1';
import testSkill2 from './skills/testSkill2';
import testSkill3 from './skills/testSkill3';

// Skills added here will turn into endpoints in server app
const skills = [
  testSkill1,
  testSkill2,
  testSkill3
];

// Clean and merge all skills
const mergedSkills = [];

skills.forEach((skill) => {
  // Find duplicate skill
  let duplicatedSkillIndex = null;
  const duplicatedSkill = mergedSkills.find((mergedSkill, i) => {
    duplicatedSkillIndex = i;
    return mergedSkill.skillName === skill.skillName;
  });

  // Merge endpoints if skill is duplicated
  if (duplicatedSkill) {
    skill.endpoints.forEach((skillEndpoint) => {
      mergedSkills[duplicatedSkillIndex].endpoints.push(skillEndpoint);
    });
    return;
  }

  // Add new skill to array if not duplicated
  mergedSkills.push(skill);
});

export default mergedSkills;