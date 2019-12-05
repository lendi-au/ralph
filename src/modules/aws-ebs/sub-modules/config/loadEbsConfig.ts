import { EbsConfig } from "./EbsConfig";

export const loadEbsConfig = (): EbsConfig => {
  const sourceAwsRegion = process.env.AWS_REGION || "";
  const targetAwsRegion = process.env.QUARANTINE_AWS_REGION || "";
  const targetAwsAccounts = !process.env.QUARANTINE_AWS_ACCOUNTS ? [] : process.env.QUARANTINE_AWS_ACCOUNTS.split(",");
  const transferAllSnapshots = process.env.TRANSFER_ALL_SNAPSHOTS == "true";

  return {
    sourceAwsRegion,
    targetAwsRegion,
    targetAwsAccounts,
    transferAllSnapshots,
  };
};
