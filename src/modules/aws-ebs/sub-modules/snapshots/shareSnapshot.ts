import { EC2 } from "aws-sdk";
import { EbsConfig } from "../config/EbsConfig";
import { logger } from "../../../../logger";

export const shareSnapshot = async (config: EbsConfig, snapshotId: string): Promise<void> => {
  const params = {
    SnapshotId: snapshotId,
    Attribute: "createVolumePermission",
    OperationType: "add",
    UserIds: config.quarantineAwsAccounts,
  };

  logger.info(`Sharing snapshot ${snapshotId} to ${config.quarantineAwsAccounts}`);
  const ec2 = new EC2({ region: config.quarantineAwsRegion });
  await ec2.modifySnapshotAttribute(params).promise();
};
