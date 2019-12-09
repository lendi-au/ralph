import { EC2 } from "aws-sdk";

export const describeVolumes = async (instanceId: string): Promise<(string)[]> => {
  const ec2 = new EC2();
  const params = {
    Filters: [
      {
        Name: "attachment.instance-id",
        Values: [instanceId],
      },
    ],
  };

  const describeVolumes = await ec2.describeVolumes(params).promise();
  if (!describeVolumes.Volumes) {
    return [];
  }

  return describeVolumes.Volumes.map(volumes => {
    return volumes.VolumeId || "";
  }).filter(volumeId => {
    return volumeId !== "";
  });
};
