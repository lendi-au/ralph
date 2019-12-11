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

  if (!snapshotAttribute.Snapshots || !snapshotAttribute.Snapshots[0]) {
    throw new Error(`Snapshot ${SnapshotId} is missing or has missing required attributes.`);
  }
  const snapshot = snapshotAttribute.Snapshots[0];

  if (!snapshot.State || !snapshot.Progress || !snapshot.VolumeSize) {
    throw new Error(`Snapshot ${SnapshotId} is missing or has missing required attributes.`);
  }

  return {
    state: snapshot.State,
    progress: snapshot.Progress,
    volumeSize: snapshot.VolumeSize,
  };
};
