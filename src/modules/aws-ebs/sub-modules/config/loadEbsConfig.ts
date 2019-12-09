import { EbsConfig } from "./EbsConfig";

export const isEnvironmentVariableDefined = (environmentVariable: string | undefined): boolean => {
  return (environmentVariable && environmentVariable !== "undefined") === true;
};

export const loadEbsConfig = (): EbsConfig => {
  let sourceAwsRegion: string;

  if (process.env.AWS_REGION && process.env.AWS_REGION !== "undefined") {
    sourceAwsRegion = process.env.AWS_REGION;
  } else {
    throw new Error("Env variable AWS_REGION must be defined.");
  }

  const quarantineAwsRegion: string =
    process.env.QUARANTINE_AWS_REGION && process.env.QUARANTINE_AWS_REGION !== "undefined"
      ? process.env.QUARANTINE_AWS_REGION
      : process.env.AWS_REGION;

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
