# Simple Amazon Alexa Starter Kit

This starter kit allows you to add new skills for Amazon Alexa easily. <br>
Configuration for <a href="https://developer.amazon.com/alexa">Amazon</a>
is generated automatically and saved to **amazonConfig.txt** file,
so all you have to do is to copy it to <a href="https://developer.amazon.com/alexa">Amazon Alexa website</a>

## Initialization
- git clone git@github.com:AlexSapoznikov/alexa-express-starter-kit.git
- cd alexa-express-starter-kit/
- npm install

## Commands
- npm start - builds and starts server
- npm run start-dev - starts and restarts server on code change
- npm run build - builds without starting server
- npm run create-skill [-- --name=anyname] - creates new sample skill file in *skills* folder
- npm run eslint - lints the code for errors

## The Structure

- Development is being done in *./src* folder.
- The builded code is generated to *./public* folder.
- Skills are located in *./src/skills/* folder.
- Skills are included in *./src/skills.js* file.
- Server creates intents (endpoints) automatically using merged skills in *./src/skills.js* file.
- Scripts for generating amazon configuration and new skill files are located in *./src/scripts* folder.

## How to add new skills

- Add new skill file via terminal
```
npm run create-skill -- --name=myNewSkill
```
- Edit the skill file (*./src/skills/myNewSkill.js*).
- Include it in skills array in *./src/skills.js* file

```
import myNewSkill from './skills/myNewSkill';

const skills = [
  myNewSkill,
  etc...
]
```
- Start the server
```
    npm run start
    // or
    npm run start-dev
```

- Use <a href="https://ngrok.com/">ngrok</a> for development.
    - Download <a href="https://ngrok.com/">ngrok</a>
    - Navigate to ngrok location via terminal and run it
    ```
    // Exposes your localhost to the internet
    ./ngrok http 5000
    ```

- Do a setup in <a href="https://developer.amazon.com/alexa">Amazon Alexa website</a>
    - Sign in to <a href="https://developer.amazon.com/alexa">Amazon Alexa website</a>
    - Add new skill
    - Copy-paste generated configuration from **./amazonConfig.txt** to required fields.
    
Alexa is now ready for testing.
