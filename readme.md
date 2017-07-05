# Node Alexa Starter Kit

The purpose of this starter kit is to boost up Amazon Alexa custom skill development speed.
This starter kit simplifies development of multiple skills within a single project. It generates
configuration (intent schemas, utterances, slot values) for Amazon Developer Console automatically and stores them for each skill separately.
No changes needed in server code. Development in local machine is done using express.
Server restarts itself and new configuration is regenerated automatically when code is changed. In that way the changes can be tested
immediately unless intent names, utterances or slots are changed (in which case configuration should be updated on amazon developer console).
This kit is able to run custom skills in express server and also deploy to AWS lambda.

**This kit uses <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> module, visit the page
for more information about functionality and customizing server if needed.**

## Updates
- <a href="https://github.com/AlexSapoznikov/node-alexa-starter-kit/blob/master/~updates/v1.0.1.md">v1.0.1</a> - endpoint for config
- v1.0.2 - update some links in readme
- v1.0.3 - update alexa-app and aws-sdk

## Contents
- <a href="#init">Initialization</a>
- <a href="#commands">Commands (npm scripts)</a>
- <a href="#structure">Structure</a>
- <a href="#projectConf">Project configuration</a>
- <a href="#addSkill">Adding new skill and running it</a>
- <a href="#skillfile">Skill file</a>
    - <a href="#handler">Handler</a>
        - <a href="#handlerReq">Request</a>
        - <a href="#handlerRes">Response</a>
        - <a href="#handlerSession">Session</a>
- <a href="#server">Server</a>
- <a href="#amazonconf">Amazon Developer Console configuration</a>
    - <a href="#amazonConfigScreenshots">Steps with screenshots</a>
- <a href="#deploy">Deploying to AWS Lambda</a>
    - <a href="#awsConfig">Configuring S3 and Lambda steps with screenshots</a>
- <a href="#licence">Licence</a>
- <a href="#about">About</a>

## <a name="init">Initialization</a>
- ```git clone git@github.com:AlexSapoznikov/node-alexa-starter-kit.git```
- ```cd node-alexa-starter-kit/```
- ```npm install```

## <a name="commands">Commands</a>
- ```npm start``` - builds and starts server
- ```npm run start-dev``` - starts and restarts server on code change
- ```npm run deploy``` - deploys to lambda
- ```npm run build``` - builds without starting server
- ```npm run create-skill [-- --name=anyname]``` - creates new sample skill file in *skills* folder
- ```npm run expose``` - exposes your localhost to the internet
- ```npm run eslint``` - lints the code for errors
- ```npm run test``` - runs tests

## <a name="structure">Structure</a>

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
static                              // Front-end files for displaying configuration
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
    events.js                           // Events (launch, pre, post, sessionEnd, error)
    server.js                           // Server code
įmages                              // Screenshots
```

- Development is being done in *./src* folder.
- The builded code is generated to *./public* folder.
- Configuration files are located in *./config*.
- Skills are located in *./src/skills/* folder.
- Events are located in *./src/events.js* file.
- Server creates intents (endpoints) automatically using merged skills by *./src/utils/mergeSkills.js* file.
- Scripts for generating amazon configuration and new skill files are located in *./src/scripts* folder.
- Error messages are located in *./src/errorMessages.js* file

## <a name="projectConf">Project configuration</a>

Location for configuration files is **./config**
<a href="https://github.com/DeadAlready/node-easy-config">easy-config</a> is used for project configuration.

- `./config/config.json` - public config file, **do NOT** use keys and secrets in this file.
- `./config/config.dev.json` - private config file, **overrides** `./config/config.json` if NODE_ENV=development environment used, use keys and secrets here and **do NOT** commit that file.
- `./config/config.test.json` - config file for tests, overrides `./config/config.json` if NODE_ENV=test environment used. Do not commit keys and secrets.

Configuration file looks like this:

```
{
  "server": {
    "host": "localhost",
    "port": 5000,
    "accessEndpoint": "alexa"               // Endpoint for accessing custom skill. May be empty.
  },
  "deploy": {
    "aws": {
      "region": "us-east-1",                // AWS region
      "accessKeyId": "",                    // AWS access key
      "secretAccessKey": "",                // AWS secret access key
      "bucketName": "my-bucket-name",       // S3 Bucket name
      "fileName": "myAlexaProject",         // Name of compressed file that will be uploaded to lambda on deploy

      "lambda": {
        "functionName": "myAlexaFunction"
      }
    }
  },
  "locations": {
    "amazonConfig": "../amazonConfig/",     // This is where Amazon Developer Console configuration will be written to
    "skillsLocation": "/skills"             // This is where all skills files are located
  }
}
```

- `Server` contains everything needed for running express server and developing in local machine
- `Deploy` contains everything needed for deploying to AWS Lambda
- `Locations` contains configurable folder locations

## <a name="addSkill">Adding new skill and running it</a>

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
    - Copy-paste generated configuration from https://your-ngrok-url/config (for example: https://1616ed15.ngrok.io/config) or <a href="#amazonconf">**./amazonConfig**</a> folder to required fields.
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
    // if no need to provide values
    slots: {
        slotName1: "myCustomSlotType",
        slotName2: "AMAZON.[built-in-intent]",
    }

    // if values needed:

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

### <a name="handler">Handler</a>

Handlers for launch, intent, and session<br>
Documentation about handler objects is copied from <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> npm module,
because current starter kit uses it's functionality.

#### <a name="handlerReq">Request</a>

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

#### <a name="handlerRes">Response</a>

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


#### <a name="handlerSession">Session</a>

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

## <a name="server">Server</a>

Usually there is no need for making changes to the server code.<br>
Server code is located in **./src/server.js** file. <br>
- Merges skill files and initializes intents.
- Exports Alexa app and handler for AWS Lambda.
- Events like *launch*, *pre*, *post*, *sessionEnded*, *error* are moved to **./src/events.js**.
- To disable persisting every request session attribute into response: in server file, set `app.persistentSession` to `false`

For more functionality and options visit <a href="https://www.npmjs.com/package/alexa-app">alexa-app</a> npm module.

## <a name="amazonconf">Amazon Developer Console configuration</a>

When starting server, Amazon configuration is written to **amazonConfig** folder.<br>
Configuration is separated into different folders that are named after skill names<br>
Configuration can be found also on `localhost:port/config` url.<br>
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

### <a name="amazonConfigScreenshots">Steps with screenshots</a>

1) Go to https://developer.amazon.com and sign in <br>
2) Choose Alexa Tab <br>

![1_alexaTab.png](/~images/amazonDeveloperConsole/1_alexaTab.png?raw=true)

3) Choose Alexa Skills Kit <br>

![2_chooseSkillKit.png](/~images/amazonDeveloperConsole/2_chooseSkillKit.png?raw=true)

4) Add new skill <br>

![3_addNewSkill.png](/~images/amazonDeveloperConsole/3_addNewSkill.png?raw=true)

5) Add skill name and invocation name. (Check *Audio Player* if you will use audio files) <br>

![4_addSkillName.png](/~images/amazonDeveloperConsole/4_addSkillName.png?raw=true)

6) Add interaction model - intent schema, sample utterances and slot values (if exist).
Copy-paste them from `localhost:port/config` url or **amazonConfig** folder (<a href="#amazonconf">details</a>). <br>

![5_addSchema.png](/~images/amazonDeveloperConsole/5_addSchema.png?raw=true)

7) Add url - for setting up express server or testing with this starter kit use https.
For development use ngrok to <a href="#expose">expose your localhost to the web</a> and copy ngrok url to Amazon Developer Console. <br>

![6_addUrl.png](/~images/amazonDeveloperConsole/6_addUrl.png?raw=true)

8) Amazon also allows to test skill in test section. <br>

![7_test.png](/~images/amazonDeveloperConsole/7_test.png?raw=true)

Your skill should now be up and running. <br>
Changes should work as soon as server restarts itself (automatically, if `npm run start-dev` used).<br>
**If intent name, utterances or slot values changed in code,
configuration on Amazon Developer Console must be updated**.

## <a name="deploy">Deploying to AWS Lambda</a>

- Create new S3 Bucket in <a href="https://console.aws.amazon.com">AWS Amazon Console</a>
- Create new Lambda function in <a href="https://console.aws.amazon.com">AWS Amazon Console</a>
- Modify <a href="#projectConf">configuration file</a>
    - Add credentials
    - Add bucket name for the bucket that was created in the first step
    - Add fileName for compressed file that will be deployed to Lambda
    - Add name for Lambda function
- Deploy using `npm run deploy` command in terminal

### <a name="awsConfig">Configuring S3 and Lambda steps with screenshots</a>

1) Go to <a href="https://console.aws.amazon.com">AWS Amazon Console</a> and sign in
2) Go to **S3** Service
3) Create bucket
    - Click on *create bucket* button
        ![1_createBucketButton.png](/~images/aws/1_createBucketButton.png?raw=true)
    - Fill needed fields and click *create*.
        ![2_fillBucketField.png](/~images/aws/2_fillBucketField.png?raw=true)
4) Go to **Lambda** Service
    - Choose same region that was used when creating bucket
        ![3_chooseRegion.png](/~images/aws/3_chooseRegion.png?raw=true)
    - Click on *Get started now* button if you are doing it first time
        ![4_getStartedNowButton.png](/~images/aws/4_getStartedNowButton.png?raw=true)
    - Click on *Create a lambda function* button
        ![5_createLambdaFunctionButton.png](/~images/aws/5_createLambdaFunctionButton.png?raw=true)
    - Setup new lambda function
        - In *Select blueprint window* Select runtime to latest Node version and click on *Blank Function*
            ![6_runtimeBlanckFunc.png](/~images/aws/6_runtimeBlanckFunc.png?raw=true)
        - Click on empty box and choose *Alexa Skills Kit*, then click *Next* button
            ![7_trigger.png](/~images/aws/7_trigger.png?raw=true)
        - In *Function Configuration* window fill *name* and for existing role choose `lambda_basic_execution`, other changes are optional.
          Make sure *index.handler* is set in *Handler* field. Then click *next*
            ![8_functionConf.png](/~images/aws/8_functionConf.png?raw=true)
        - In *Review* window click *Create function* button
            ![9_review.png](/~images/aws/9_review.png?raw=true)
        - Copy ARN top right, you will need that in Amazon Developer Console settings
            ![10_copyArn.png](/~images/aws/10_copyArn.png?raw=true)
5) Get your AWS credentials
    - Go to **IAM** Service, then go to *users* tab and click on your user name
        ![11_usersTab.png](/~images/aws/11_usersTab.png?raw=true)
    - Go to *security credentials* tab and click on *Create access key* button
        ![12_credentialsTab.png](/~images/aws/12_credentialsTab.png?raw=true)
    - Copy your Access key ID and Secret access key
        ![13_copyCredentials.png](/~images/aws/13_copyCredentials.png?raw=true)
6) Edit <a href="#projectConf">configuration file</a> in **./config/**
    - Add your credentials (Access key ID and Secret access key)
    - Add your bucket name my-alexa-bucket-name
    - Add your lambda function name myLambdaFunction
    - You may also want to change name for compressed file
7) Run `npm run deploy` command in terminal to deploy.

8) Configuration in <a href="https://developer.amazon.com">Amazon Developer Console</a>
    - <a href="#amazonConfigScreenshots">Follow steps for setting up skill in Amazon Developer Console in previous chapter</a>,
    but when adding url, choose *AWS Lambda ARN* and insert arn you copied before when setting up AWS Lambda (in Lambda Service).
       ![14_amazonConfLambda.png](/~images/aws/14_amazonConfLambda.png?raw=true)

## <a name="licence">Licence</a>

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

## <a name="about">About</a>

Node Alexa Starter Kit is maintained by nodeSWAT – an agile development team of NodeJS enthusiasts and professionals. More info at www.nodeswat.com

<img src="https://raw.githubusercontent.com/AlexSapoznikov/node-alexa-starter-kit/master/~images/logo/nodeSWAT.png?raw=true" width="350px">