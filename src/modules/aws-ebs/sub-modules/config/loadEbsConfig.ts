import { EbsConfig } from "./EbsConfig";
import { AwsRegion } from "../../../region/AwsRegion";
import { extractAwsRegion } from "../../../region/extractAwsRegion";

export const isEnvironmentVariableDefined = (environmentVariable: string | undefined): boolean => {
  return (environmentVariable && environmentVariable !== "undefined") === true;
};

export const loadEbsConfig = (): EbsConfig => {
  let sourceAwsRegion: AwsRegion;

  if (process.env.AWS_REGION && process.env.AWS_REGION !== "undefined") {
    sourceAwsRegion = extractAwsRegion(process.env.AWS_REGION);
  } else {
    throw new Error("Env variable AWS_REGION must be defined.");
  }

  const quarantineAwsRegion: AwsRegion =
    process.env.QUARANTINE_AWS_REGION && process.env.QUARANTINE_AWS_REGION !== "undefined"
      ? extractAwsRegion(process.env.QUARANTINE_AWS_REGION)
      : sourceAwsRegion;

  const quarantineAwsAccounts: string[] =
    process.env.QUARANTINE_AWS_ACCOUNTS && process.env.QUARANTINE_AWS_ACCOUNTS !== "undefined"
      ? process.env.QUARANTINE_AWS_ACCOUNTS.split(",").map(account => {
          return account.trim();
        })
      : [];

  const transferAllSnapshots: boolean =
    process.env.TRANSFER_ALL_SNAPSHOTS && process.env.TRANSFER_ALL_SNAPSHOTS !== "undefined"
      ? process.env.TRANSFER_ALL_SNAPSHOTS == "true"
      : false;

  return {
    sourceAwsRegion,
    quarantineAwsRegion,
    quarantineAwsAccounts,
    transferAllSnapshots,
  };
};
