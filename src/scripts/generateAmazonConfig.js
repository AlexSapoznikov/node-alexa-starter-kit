'use strict';
/**
 * Creates config for Amazon website and saves it to 'amazonConfig.txt' file
 */

import { writeFile } from 'fs';
import alexaUtterances from 'alexa-utterances';

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
      let slots = null;
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
      invocationName: skill.invocationName,
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
      endpoint.utterances.forEach((utterance) => {
        const alexaUtterancesList = alexaUtterances(utterance, endpoint.slots);

        alexaUtterancesList.forEach((alexaUtterance) => {
          utterances.push(`${endpoint.intentName}\t${(alexaUtterance.replace(/\s+/g, ' ')).trim()}`);
        });
      });
    });

    allUtterances.push({
      skillName: skill.skillName,
      invocationName: skill.invocationName,
      sampleUtterances: utterances
    });
  });

  return allUtterances;
}

function generateAmazonConfig(skills, showInConsole, printToFile) {
  const instructions = [];
  const schemas = generateSchemas(skills);
  const utterances = generateUtterances(skills);

  schemas.forEach((schema, i) => {
    instructions.push(`--------------------------------`);
    instructions.push(`SKILL ${i + 1}: ${schema.skillName}`);
    instructions.push(`--------------------------------`);
    instructions.push(`Name: ${schema.skillName}`);
    instructions.push(`Invocation Name: ${schema.invocationName}`);
    instructions.push(`Intent Schema: \n${JSON.stringify(schema.intentSchema, null, 2)}`);
    instructions.push(`Sample Utterances:\n${utterances[i].sampleUtterances.join('\n')}`);
    instructions.push(`\n`);
  });

  const amazonConfig = `\nAmazon configs:\n\n${instructions.join('\n')}`;

  if (showInConsole) {
    // eslint-disable-next-line no-console
    console.log(amazonConfig);
  }

  if (printToFile) {
    writeFile('amazonConfig.txt', amazonConfig, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`Could not write amazon config to 'amazonConfig.txt'`);
        return;
      }

      // eslint-disable-next-line no-console
      console.log(`Amazon config written to 'amazonConfig.txt'`);
    });
  }
}