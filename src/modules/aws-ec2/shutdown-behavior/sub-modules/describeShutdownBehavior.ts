import { EC2 } from "aws-sdk";

export const describeShutdownProtection = async (instanceId: string) => {
  const ec2 = new EC2();
  const params = {
    Attribute: "instanceInitiatedShutdownBehavior",
    InstanceId: instanceId
  };
  const value = await ec2.describeInstanceAttribute(params).promise();
  if (!value.InstanceInitiatedShutdownBehavior) {
    return;
  }
  return value.InstanceInitiatedShutdownBehavior.Value;
};
