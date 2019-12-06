import { EC2 } from "aws-sdk";
import { EbsConfig } from "../config/EbsConfig";
import { buildCopySnapshotDescription } from "./buildCopySnapshotDescription";
import { logger } from "../../../../logger";

export const copySnapshotToTargetRegion = async (config: EbsConfig, snapshotId: string): Promise<string> => {
  const ec2 = new EC2({ region: config.quarantineAwsRegion });
  const params = {
    Description: buildCopySnapshotDescription(config, snapshotId),
    SourceRegion: config.sourceAwsRegion,
    SourceSnapshotId: snapshotId,
  };

  const result = await ec2.copySnapshot(params).promise();
  if (!result.SnapshotId) {
    throw new Error("Copied snapshot did not return a SnapshotId");
  }
  logger.info(`Copied snapshot ${snapshotId} to region ${config.quarantineAwsRegion}: ${result.SnapshotId}`);
  return result.SnapshotId;
};
