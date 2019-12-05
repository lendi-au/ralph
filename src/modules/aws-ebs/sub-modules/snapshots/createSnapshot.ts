import { EC2 } from "aws-sdk";

export const createSnapshot = async (volumeId: string): Promise<string> => {
  const ec2 = new EC2();
  const params = {
    VolumeId: volumeId,
    Description: `[Ralph] Latest snapshot for ${volumeId}`,
  };

  const createdSnapshot = await ec2.createSnapshot(params).promise();
  if (!createdSnapshot.SnapshotId) {
    throw new Error("No SnapshotId returned when creating snapshot.");
  }

  return createdSnapshot.SnapshotId;
};
