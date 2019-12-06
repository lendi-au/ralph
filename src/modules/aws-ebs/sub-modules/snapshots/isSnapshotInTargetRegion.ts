import { EbsConfig } from "../config/EbsConfig";

export const isSnapshotInquarantineRegion = (config: EbsConfig): boolean => {
  return config.sourceAwsRegion === config.quarantineAwsRegion;
};
