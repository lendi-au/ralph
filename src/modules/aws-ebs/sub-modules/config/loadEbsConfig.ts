import { EbsConfig } from "./EbsConfig";

export const loadEbsConfig = (): EbsConfig => {
  const sourceAwsRegion = process.env.sourceAwsRegion || "";
  const targetAwsRegion = process.env.targetAwsRegion || "";
  const targetAwsAccounts = !process.env.targetAwsAccounts ? [] : process.env.targetAwsAccounts.split(",");
  const transferAllSnapshots = process.env.transferAllSnapshots == "true";

  return {
    sourceAwsRegion,
    targetAwsRegion,
    targetAwsAccounts,
    transferAllSnapshots,
  };
};
