'use strict';

import config from 'easy-config';
import archiver from 'archiver';
import AWS from 'aws-sdk';
import { createWriteStream, readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';

const compressedProjectLocation = resolvePath(__dirname, '..', '..', 'data', config.deploy.aws.fileName + '.zip');

// Set aws config
AWS.config.update({
  region: config.deploy.aws.region,
  accessKeyId: config.deploy.aws.accessKeyId,
  secretAccessKey: config.deploy.aws.secretAccessKey
});

// Init S3
const S3 = new AWS.S3({
  params: {
    Bucket: config.deploy.aws.bucketName,
    Key: config.deploy.aws.fileName
  }
});

// Init Lambda
const lambda = new AWS.Lambda();
const lambdaOpts = {
  FunctionName: config.deploy.aws.lambda.functionName,
  S3Key: config.deploy.aws.fileName,
  S3Bucket: config.deploy.aws.bucketName
};

function compress () {
  return new Promise((resolve) => {
    console.log('1. Compressing...');  // eslint-disable-line
    const output = createWriteStream(compressedProjectLocation);
    const archive = archiver('zip');

    archive.pipe(output);
    archive
      .directory('config', 'config')
      .directory('node_modules', 'node_modules')
      .directory('public', 'public')
      .file('package.json')
      .file('index.js')
      .finalize();

    output.on('close', () => {
      console.log(' - Compressing was successful');  // eslint-disable-line
      resolve();
    });
    archive.on('error', (err) => {
      throw new Error('Could not compress: ' + err);
    });
  });
}

function upload () {
  return new Promise((resolve) => {
    console.log('2. Uploading...');  // eslint-disable-line
    const file = readFileSync(compressedProjectLocation);

    S3.upload({
      Body: file
    }, (err, data) => {
      if (err) {
        throw new Error('Failed to upload: ' + err);
      }

      lambdaOpts.S3ObjectVersion = data.VersionId;
      console.log(' - Upload was successful');  // eslint-disable-line
      resolve();
    });
  });
}

function updateLambda () {
  return new Promise((resolve) => {
    console.log('3. Updating lambda function...');  // eslint-disable-line
    lambda.updateFunctionCode(lambdaOpts, (err, data) => {
      if (err) {
        throw new Error('Failed to update lambda function:' + err);
      }

      console.log(' - Updating lambda function was successful');  // eslint-disable-line
    });
  });
}

// Deploy
compress()
  .then(upload)
  .then(updateLambda)
  .then(() => {
    console.log('Deploy done.');  // eslint-disable-line
  });