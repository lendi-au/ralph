#!/usr/bin/env node
import * as yargs from 'yargs';
import * as AWS from 'aws-sdk';

// set the default region
AWS.config.update({ region: 'ap-southeast-2'});

// tslint:disable-next-line:no-unused-expression
yargs
  .help()
  .demandCommand()
  .strict()
  .commandDir('commands', { extensions: ['js', 'ts'] }).argv;
