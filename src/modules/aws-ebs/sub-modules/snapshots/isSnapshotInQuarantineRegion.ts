import { EbsConfig } from "../config/EbsConfig";

export const isSnapshotInQuarantineRegion = (config: EbsConfig): boolean => {
  return config.sourceAwsRegion === config.quarantineAwsRegion;
};
