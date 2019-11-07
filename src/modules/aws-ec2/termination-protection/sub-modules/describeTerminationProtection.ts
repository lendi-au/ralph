import { EC2 } from "aws-sdk";

export const describeTerminationProtection = async (instanceId: string): Promise<void | boolean> => {
  const ec2 = new EC2();
  const params = {
    Attribute: "disableApiTermination",
    InstanceId: instanceId,
  };
  const value = await ec2.describeInstanceAttribute(params).promise();
  if (!value.DisableApiTermination) {
    return;
  }
  return value.DisableApiTermination.Value;
};
