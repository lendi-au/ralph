import { EbsConfig } from "../loadEbsConfig";

export const isSnapshotInTargetRegion = (config: EbsConfig): boolean => {
  return config.sourceAwsRegion === config.targetAwsRegion;
};
