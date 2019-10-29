#!/usr/bin/env node
import * as yargs from "yargs";
import * as AWS from "aws-sdk";
import * as dotenv from "dotenv";

dotenv.config();
// set the default region
AWS.config.update({ region: process.env.AWS_REGION });

// tslint:disable-next-line:no-unused-expression
yargs
  .help()
  .demandCommand()
  .strict()
  .commandDir("commands", { extensions: ["js", "ts"] }).argv;
