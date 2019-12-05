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

  const volumes = describeVolumes.Volumes.map(volumes => {
    if (!volumes.VolumeId) return "";

    return volumes.VolumeId;
  });

  return volumes;
};
