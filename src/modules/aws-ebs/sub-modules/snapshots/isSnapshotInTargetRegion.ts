import { EbsConfig } from "../config/EbsConfig";

export const isSnapshotInTargetRegion = (config: EbsConfig): boolean => {
  return config.sourceAwsRegion === config.targetAwsRegion;
};
