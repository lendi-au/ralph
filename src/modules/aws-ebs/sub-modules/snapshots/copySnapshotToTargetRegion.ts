import { EC2 } from "aws-sdk";
import { EbsConfig } from "../loadEbsConfig";
import { buildCopySnapshotDescription } from "./buildCopySnapshotDescription";

export const copySnapshotToTargetRegion = async (config: EbsConfig, snapshotId: string): Promise<string> => {
  const ec2 = new EC2({ region: config.targetAwsRegion });
  const params = {
    Description: buildCopySnapshotDescription(config, snapshotId),
    SourceRegion: config.sourceAwsRegion,
    SourceSnapshotId: snapshotId,
  };
  const result = await ec2.copySnapshot(params).promise();

  if (!result.SnapshotId) {
    throw new Error("Copied snapshot did not return a SnapshotId");
  }
  return result.SnapshotId;
};
