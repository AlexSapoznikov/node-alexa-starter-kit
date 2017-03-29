# Simple Amazon Alexa Starter Kit

The purpose of this starter kit is to boost up Amazon Alexa custom skill development speed.
This starter kit simplifies development of multiple skills within a single project. It generates
configuration (intent schemas, utterances, slot values) for Amazon Developer Console automatically and stores them for each skill separately.
No changes (or minimal changes for more complex skills) needed in server code. Server restarts itself and new
configuration is regenerated automatically when code is changed. In that way the changes can be tested
immediately unless intent names, utterances or slots are changed (in which case configuration should be updated on amazon developer console).

**This kit uses <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> module, visit the page
for more information about functionality and customizing server if needed.**

## Initialization
- ```git clone git@github.com:AlexSapoznikov/alexa-express-starter-kit.git```
- ```cd alexa-express-starter-kit/```
- ```npm install```

## Commands
- ```npm start``` - builds and starts server
- ```npm run start-dev``` - starts and restarts server on code change
- ```npm run build``` - builds without starting server
- ```npm run create-skill [-- --name=anyname]``` - creates new sample skill file in *skills* folder
- ```npm run expose``` - exposes your localhost to the internet
- ```npm run eslint``` - lints the code for errors
- ```npm run test``` - runs tests

## The Structure

```
amazonConfig                        // Configuration for amazon developer console is generated here
    [skillName]                     // Configuration is separated by skill name
        intentSchema.json               // Generated intent schema
        sampleUtterances.txt            // Generated utterances
        slots
            [slotType].txt              // Generated slot values
config                              // Project configuration
    config.json
    config.test.json
    config.dev.json
data
    sampleSkill                         // Sample skill that is used for creating new skill file
public                              // Code compiled using babel
src
    scripts
        execNgrok.js                    // Script for exposing localhost to web
        generateAmazonConfig.js         // Script for generating configuration for Amazon Development Console
        generateNewSkill.js             // Script for generating new skill
    skills                          // All skills should be added here!
        dateExampleSkill.js             // Example skill - delete it!
        dogExampleSkill.js              // Example skill - delete it!
        questionExampleSkill.js         // Example skill - delete it!
    test
        skills                      // Example skills for testing
            dateExampleSkill.js
            dogExampleSkill.js
            questionExampleSkill.js
        helpers.js                      // Helper functions for testing
        testServer.js                   // Tests for server
        testSkills.js                   // Tests for merging skills
    utils
        mergeSkills.js                  // Merging skills
    errorMessages.js                    // Error messages for Alexa
    server.js                           // Server code
```

- Development is being done in *./src* folder.
- The builded code is generated to *./public* folder.
- Configuration files are located in *./config*.
- Skills are located in *./src/skills/* folder.
- Server creates intents (endpoints) automatically using merged skills by *./src/utils/mergeSkills.js* file.
- Scripts for generating amazon configuration and new skill files are located in *./src/scripts* folder.
- Error messages are located in *./src/errorMessages.js* file

## Project configuration

<a href="https://github.com/DeadAlready/node-easy-config">easy-config</a> is used for project configuration.

- `./config/config.json` - public config file, **do NOT** use keys and secrets in this file.
- `./config/config.dev.json` - private config file, **overrides** `./config/config.json` if NODE_ENV=development environment used, use keys and secrets here and **do NOT** commit that file.
- `./config/config.dev.json` - config file for tests, overrides `./config/config.json` if NODE_ENV=test environment used. Do not commit keys and secrets.

## How to add new skills

- Add new skill file via terminal
```
npm run create-skill -- --name=myNewSkill
```
- Edit the <a href="#skillfile">skill file</a> (*./src/skills/myNewSkill.js*).
- Start the server
```
    npm run start
    // or
    npm run start-dev   // restarts server on code change
```

- For development, <a name="expose">expose your localhost to the internet.</a>
    - Start ngrok in separate terminal window
```
        npm run expose
```

    - Look for the output to find <a name="alexaendpoint">alexa endpoint</a>. Output looks like this:

```
        -------------------------------------------
        Status: online
        Forwarding: https://1616ed15.ngrok.io -> http://localhost:3000
        Web Interface: http://127.0.0.1:4040
        Endpoint for Alexa: https://1616ed15.ngrok.io/alexa
        -------------------------------------------

        (In this example https://1616ed15.ngrok.io/alexa is correct url to use)
```

- <a href="#amazonconf">Do a setup</a> in <a href="https://developer.amazon.com/alexa">Amazon Developer Console</a>
    - Sign in to <a href="https://developer.amazon.com/alexa">Amazon Developer Console</a>
    - Add new skill
    - Copy-paste generated configuration from <a href="#amazonconf">**./amazonConfig**</a> folder to required fields.
    - Use <a href="#alexaendpoint">https url generated by ngrok</a> in previous step
    
Alexa is now ready for testing.

- To invoke custom skill, say: *Alexa, ask [invocationName] [question using utterances]*
- For more information about invoking custom skills, visit <a href="https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/supported-phrases-to-begin-a-conversation">Amazon Developer commands page</a>

## <a name="skillfile">Skill file</a>

Skill file looks like this:

```
export default {
  skillName: 'dog',
  intents: [
    {
      intentName: 'dogNumber',
      slots: {
        number: 'AMAZON.NUMBER'
      },
      utterances: [
        'say the number {-|number}',
        'find {-|number}'
      ],
      response: (request, response) => {
        const number = request.slot('number');
        response.say(`The number you asked to say is ${number}`);
      }
    }
  ]
};
```

- skillName - name of skill that is displayed to customers in the Alexa app. Must be between 2-50 characters.
- intents - array on intents
- intentName - name of intent
- slots - variables for getting what user says. Can be declared in two ways:

```
    slots: {
        slotName1: "myCustomSlotType",
        slotName2: "AMAZON.[built-in-intent]",
    }

    // or if values needed:

    slots: {
        slotName1: {
          type: 'myCustomSlotType',
          values: [
            'value1',
            'value2',
            'etc'
          ]
        },
        slotName2: "AMAZON.[built-in-intent]"
    }
```

- utterances - these are what people say to interact with skill. Examples:

```
    // Use like this to get value from slot
    I want to go to {-|slotName}

    // Use like this to provide different options
    I want to go to {school|shop|work}
        // add another vertical bar ( | ) after "work" if empty option allowed
```

- response - response from alexa

### Handler

Request and response objects that can be used.<br>
Documentation about handler objects is copied from <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> npm module,
because current starter kit uses it's functionality.

#### Request

```
// return the type of request received (LaunchRequest, IntentRequest, SessionEndedRequest)
String request.type()

// return the value passed in for a given slot name
String request.slot("slotName")

// check if you can use session (read or write)
Boolean request.hasSession()

// return the session object
Session request.getSession()

// return the request context
request.context

// the raw request JSON object
request.data
```

#### Response

```
// tell Alexa to say something; multiple calls to say() will be appended to each other
// all text output is treated as SSML
response.say(String phrase)

// empty the response text
response.clear()

// tell Alexa to re-prompt the user for a response, if it didn't hear anything valid
response.reprompt(String phrase)

// return a card to the user's Alexa app
// for Object definition @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/alexa-skills-kit-interface-reference#card-object
// skill supports card(String title, String content) for backwards compat of type "Simple"
response.card(Object card)

// return a card instructing the user how to link their account to the skill
// this internally sets the card response
response.linkAccount()

// play audio stream (send AudioPlayer.Play directive) @see https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play-directive
// skill supports stream(String url, String token, String expectedPreviousToken, Integer offsetInMilliseconds)
response.audioPlayerPlayStream(String playBehavior, Object stream)

// stop playing audio stream (send AudioPlayer.Stop directive)
response.audioPlayerStop()

// clear audio player queue (send AudioPlayer.ClearQueue directive)
// clearBehavior is "CLEAR_ALL" by default
response.audioPlayerClearQueue([ String clearBehavior ])

// tell Alexa whether the user's session is over; sessions end by default
// you can optionally pass a reprompt message
response.shouldEndSession(boolean end [, String reprompt] )

// send the response to the Alexa device (success)
// this is not required for synchronous handlers
// you must call this from asynchronous handlers
response.send()

// trigger a response failure
// the internal promise containing the response will be rejected, and should be handled by the calling environment
// instead of the Alexa response being returned, the failure message will be passed
response.fail(String message)

// calls to response can be chained together
response.say("OK").send()
```


#### Session

```
// check if you can use session (read or write)
Boolean request.hasSession()

// get the session object
var session = request.getSession()

// set a session variable
// by defailt, Alexa only persists session variables to the next request
// the alexa-app module makes session variables persist across multiple requests
// Note that you *must* use `.set` or `.clear` to update
// session properties. Updating properties of `attributeValue`
// that are objects will not persist until `.set` is called
session.set(String attributeName, String attributeValue)

// return the value of a session variable
String session.get(String attributeName)

// session details, as passed by Amazon in the request
session.details = { ... }
```

## Server

Look ./src/server.js file in the code. <br>
Following handlers are added for editing:
- app.launch
- app.pre
- app.post
- app.sessionEnded
- app.error

For more functionality and options visit <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> npm module.

## <a name="amazonconf">Configuration for amazon</a>

When starting server, Amazon configuration is written to **amazonConfig** folder.<br>
In **amazonConfig** folder it is separated into different folders that are named after skill names<br>
The structure is following:

```
amazonConfig
    [skillName1]
        intentSchema.json
        sampleUtterances.txt
        slots
            [slotType1].txt
            [slotType2].txt
            etc...
    [skillName2]
    etc...

```

All you need to do in Amazon Developer Console is to

- Add skill name
- Add invocation name
- copy intent schema from amazonConfig folder
- copy sample utterances from amazonConfig folder
- copy slot values from amazonConfig folder

### Steps with screenshots

1) Go to https://developer.amazon.com and sign in <br>
2) Choose Alexa Tab <br>

![1_alexaTab.png](/~screenshots/1_alexaTab.png?raw=true)

3) Choose Alexa Skills Kit <br>

![2_chooseSkillKit.png](/~screenshots/2_chooseSkillKit.png?raw=true)

4) Add new skill <br>

![3_addNewSkill.png](/~screenshots/3_addNewSkill.png?raw=true)

5) Add skill name and invocation name. (Check *Audio Player* if you will use audio files) <br>

![4_addSkillName.png](/~screenshots/4_addSkillName.png?raw=true)

6) Add interaction model - intent schema, sample utterances and slot values (if exist).
Copy-paste them from **amazonConfig** folder (<a href="#amazonconf">details</a>). <br>

![5_addSchema.png](/~screenshots/5_addSchema.png?raw=true)

7) Add url - for setting up express server or testing with this starter kit use https.
For development use ngrok to <a href="#expose">expose your localhost to the web</a> and copy ngrok url to Amazon Developer Console. <br>

![6_addUrl.png](/~screenshots/6_addUrl.png?raw=true)

8) Amazon also allows to test skill in test section. <br>

![7_test.png](/~screenshots/7_test.png?raw=true)

Your skill should now be up and running. **If intent name, utterances or slot values changed in code,
configuration on Amazon Developer Console should be updated**.
Otherwise changes should work as soon as server restarts itself (automatically, if `npm run start-dev` used).

## Licence

Copyright (c) 2017 Aleksandr Sapožnikov, NodeSWAT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
