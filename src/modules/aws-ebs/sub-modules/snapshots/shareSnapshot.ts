import { EC2 } from "aws-sdk";
import { EbsConfig } from "../config/EbsConfig";

export const shareSnapshot = async (config: EbsConfig, snapshotId: string): Promise<void> => {
  const params = {
    SnapshotId: snapshotId,
    Attribute: "createVolumePermission",
    OperationType: "add",
    UserIds: config.targetAwsAccounts,
  };

  const ec2 = new EC2({ region: config.targetAwsRegion });
  await ec2.modifySnapshotAttribute(params).promise();
};
