import { EC2 } from "aws-sdk";

type SnapshotProgress = {
  state: string;
  progress: string;
  volumeSize: number;
};

export const checkSnapshotProgress = async (SnapshotId: string): Promise<SnapshotProgress> => {
  const ec2 = new EC2();
  const params = {
    SnapshotIds: [SnapshotId],
  };
  const snapshotAttribute = await ec2.describeSnapshots(params).promise();

  if (
    !snapshotAttribute.Snapshots ||
    !snapshotAttribute.Snapshots[0] ||
    !snapshotAttribute.Snapshots[0].State ||
    !snapshotAttribute.Snapshots[0].Progress ||
    !snapshotAttribute.Snapshots[0].VolumeSize
  ) {
    throw new Error(`Snapshot ${SnapshotId} is missing or has missing required attributes.`);
  }

  return {
    state: snapshotAttribute.Snapshots[0].State,
    progress: snapshotAttribute.Snapshots[0].Progress,
    volumeSize: snapshotAttribute.Snapshots[0].VolumeSize,
  };
};
