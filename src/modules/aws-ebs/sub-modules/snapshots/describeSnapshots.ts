import { EC2 } from "aws-sdk";

export const describeSnapshotIds = async (volumeId: string): Promise<(string | undefined)[]> => {
  const ec2 = new EC2();

  const params = {
    Filters: [
      {
        Name: "volume-id",
        Values: [volumeId],
      },
    ],
  };

  const snapshots = await ec2.describeSnapshots(params).promise();

  if (!snapshots.Snapshots) {
    return [];
  }

  return snapshots.Snapshots.map(snapshot => {
    return snapshot.SnapshotId;
  });
};
