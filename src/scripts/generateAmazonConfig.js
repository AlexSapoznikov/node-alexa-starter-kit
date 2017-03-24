/* eslint-disable no-console  */
'use strict';
/**
 * Creates config for Amazon website and saves it to 'amazonConfig.txt' file
 */

import config from 'easy-config';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';
import AU from 'alexa-utterances';
import { resolve as resolvePath } from 'path';
import urlJoin from 'url-join';
import mergeSkills from '../utils/mergeSkills';

const parentFolder = resolvePath(__dirname, '..');

// Generate amazon configs
mergeSkills(config.locations.skillsLocation)
  .then((skills) => {
    generateAmazonConfig(skills);
  })
  .catch((err) => {
    console.log('Could not generate amazon config:', err);
  });

module.exports = {
  generateAmazonConfig
};

// extract the schema and generate a schema JSON object
function generateSchemas (skills) {
  const allIntentSchemas = [];

  skills.forEach((skill) => {
    const schema = {
      'intents': []
    };

    skill.intents.forEach((endpoint) => {
      let slots;
      if (endpoint.slots) {
        slots = Object.keys(endpoint.slots).map((slotKey) => {
          return {
            'name': slotKey,
            'type': endpoint.slots[slotKey]
          };
        });
      }

      const intentSchema = {
        intent: endpoint.intentName,
        slots
      };
      schema.intents.push(intentSchema);
    });

    allIntentSchemas.push({
      skillName: skill.skillName,
      intentSchema: schema
    });
  });

  return allIntentSchemas;
}

// generate a list of sample utterances
function generateUtterances (skills) {
  const allUtterances = [];

  skills.forEach((skill) => {
    let utterances = [];

    skill.intents.forEach((endpoint) => {
      if (endpoint.utterances) {
        endpoint.utterances.forEach((utterance) => {
          const alexaUtterancesList = AU(utterance, endpoint.slots);

          alexaUtterancesList.forEach((alexaUtterance) => {
            utterances.push(`${endpoint.intentName} ${(alexaUtterance.replace(/\s+/g, ' ')).trim()}`);
          });
        });
      }
    });

    allUtterances.push({
      skillName: skill.skillName,
      sampleUtterances: utterances
    });
  });

  return allUtterances;
}

function generateAmazonConfig (skills) {
  const schemas = generateSchemas(skills);
  const utterances = generateUtterances(skills);

  schemas.forEach((schema, i) => {
    // Write intent scemas to file
    mkdirp(urlJoin(parentFolder, config.locations.schemas), () => {
      const intentSchemaFileLocation = urlJoin(parentFolder, config.locations.schemas, `${schema.skillName}.json`);
      writeFile(intentSchemaFileLocation, JSON.stringify(schema.intentSchema, null, 2), { flag: 'w' }, (err) => {
        if (err) {
          console.log(`Could not write intent Schema to ${intentSchemaFileLocation}`, err);
          return;
        }
        console.log(`'${schema.skillName}' intents schema written to ${intentSchemaFileLocation}`);
      });
    });

    // write utterances to file
    mkdirp(urlJoin(parentFolder, config.locations.utterances), () => {
      const utterancesFileLocation = urlJoin(parentFolder, config.locations.utterances, `${schema.skillName}.txt`);
      writeFile(utterancesFileLocation, utterances[i].sampleUtterances.join('\n'), { flag: 'w' }, (err) => {
        if (err) {
          console.log(`Could not write amazon config to ${utterancesFileLocation}`, err);
          return;
        }
        console.log(`'${schema.skillName}' utterances written to ${utterancesFileLocation}`);
      });
    });
  });
}
