#!/usr/bin/env node
import * as yargs from "yargs";
import * as dotenv from "dotenv";

dotenv.config();

// tslint:disable-next-line:no-unused-expression
yargs
  .help()
  .demandCommand()
  .strict()
  .commandDir("commands", { extensions: ["js", "ts"] }).argv;
