import { EC2 } from "aws-sdk";
import { logger } from "../../../../logger";

export const changeShutdownBehavior = async (
  instanceId: string,
  value: string
) => {
  const ec2 = new EC2();
  const params = {
    Attribute: "instanceInitiatedShutdownBehavior",
    InstanceId: instanceId,
    Value: value
  };
  await ec2.modifyInstanceAttribute(params).promise();
  logger.info(`Changed shutdown behavior to ${value} for ${instanceId}.`);
};
