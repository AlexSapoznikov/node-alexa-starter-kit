/* eslint-disable no-console  */
'use strict';
/**
 * Creates config for Amazon website and saves it to 'amazonConfig' folder
 */

import config from 'easy-config';
import { writeFile } from 'fs';
import mkdirp from 'mkdirp';
import AU from 'alexa-utterances';
import { resolve as resolvePath } from 'path';
import urlJoin from 'url-join';
import { spawn } from 'child_process';

const parentFolder = resolvePath(__dirname, '..');

module.exports = {
  generateAmazonConfig
};

function runCommand (cmd, args) {
  return new Promise((resolve, reject) => {
    const currentProcess = spawn(cmd, args);

    currentProcess.on('exit', (code, signal) => {
      if (code !== 0) {
        return reject(new Error(`ERROR running ${cmd} command: ${args.join(' ')}`));
      }
      resolve();
    });
  });
}

// extract the schema and generate a schema JSON object
function mapIntentsToConfig (skills) {
  const allIntentSchemas = [];

  skills.forEach((skill) => {
    const schema = {
      'intents': []
    };
    const utterances = [];
    const slotValues = [];

    skill.intents.forEach((endpoint) => {
      let slots;

      // Generate intent schema
      if (endpoint.slots) {
        slots = Object.keys(endpoint.slots).map((slotKey) => {
          const slot = endpoint.slots[slotKey];

          // Generate slot values
          if (slot && slot.values) {
            slotValues.push({
              'name': slotKey,
              'type': slot && slot.type,
              'values': slot.values
            });
          }

          return {
            'name': slotKey,
            'type': (slot && slot.type) || slot
          };
        });
      }

      // Generate sample utterances
      if (endpoint.utterances) {
        endpoint.utterances.forEach((utterance) => {
          const alexaUtterancesList = AU(utterance, endpoint.slots);

          alexaUtterancesList.forEach((alexaUtterance) => {
            utterances.push(`${endpoint.intentName} ${(alexaUtterance.replace(/\s+/g, ' ')).trim()}`);
          });
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
      intentSchema: schema,
      sampleUtterances: utterances,
      slotValues
    });
  });

  return allIntentSchemas;
}

function generateAmazonConfig (skills) {
  const schemas = mapIntentsToConfig(skills);

  Promise.all([
    runCommand('rm', ['-fr', urlJoin(parentFolder, config.locations.amazonConfig)])  // remove old amazon config
  ]).then(() => {
    schemas.forEach((schema) => {

      // Write intent schemas to file
      mkdirp(urlJoin(parentFolder, urlJoin(config.locations.amazonConfig, schema.skillName)), () => {
        const intentSchemaFileLocation = urlJoin(parentFolder, config.locations.amazonConfig, schema.skillName, `intentSchema.json`);
        writeFile(intentSchemaFileLocation, JSON.stringify(schema.intentSchema, null, 2), { flag: 'w' }, (err) => {
          if (err) {
            console.log(`Could not write intent Schema to ${intentSchemaFileLocation}`, err);
            return;
          }
          console.log(`'${schema.skillName}' intents schema written to ${intentSchemaFileLocation}`);
        });
      });

      // write utterances to file
      mkdirp(urlJoin(parentFolder, config.locations.amazonConfig, schema.skillName), () => {
        const utterancesFileLocation = urlJoin(parentFolder, config.locations.amazonConfig, schema.skillName, `sampleUtterances.txt`);
        writeFile(utterancesFileLocation, schema.sampleUtterances.join('\n'), { flag: 'w' }, (err) => {
          if (err) {
            console.log(`Could not write amazon config to ${utterancesFileLocation}`, err);
            return;
          }
          console.log(`'${schema.skillName}' utterances written to ${utterancesFileLocation}`);
        });
      });

      // write slot values to file
      const slotsFolderName = 'slots';
      if (schema.slotValues && schema.slotValues.length) {
        mkdirp(urlJoin(parentFolder, config.locations.amazonConfig, schema.skillName, slotsFolderName), () => {
          schema.slotValues.forEach((slotValue) => {
            if (slotValue.type) {
              const slotValuesFileLocation = urlJoin(parentFolder, config.locations.amazonConfig, schema.skillName, slotsFolderName, `${slotValue.type}.txt`);
              if (slotValue.values && slotValue.values.length) {
                writeFile(slotValuesFileLocation, slotValue.values.join('\n'), { flag: 'w' }, (err) => {
                  if (err) {
                    console.log(`Could not write amazon config to ${slotValuesFileLocation}`, err);
                    return;
                  }
                  console.log(`'${schema.skillName}' slot values written to ${slotValuesFileLocation}`);
                });
              }
            }
          });
        });
      }
    });
  });

  return schemas;
}
