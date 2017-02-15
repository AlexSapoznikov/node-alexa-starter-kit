import utterances from 'alexa-utterances';

const intent = 'test';
const dictionary = { command: [ 'say', 'repeat' ] };
const template = `${intent} {command} the number {-|number}`;

const result = utterances(template, null, dictionary);

console.log('utterances:\n');

result.forEach((u) => {
  console.log(u);
});