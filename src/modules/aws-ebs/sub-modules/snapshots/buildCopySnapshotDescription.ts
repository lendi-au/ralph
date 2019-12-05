import { EbsConfig } from "../loadEbsConfig";

export const buildCopySnapshotDescription = (config: EbsConfig, snapshotId: string): string => {
  return `[Ralph] Copied ${snapshotId} from ${config.sourceAwsRegion}`;
};
