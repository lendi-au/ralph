import { EC2 } from "aws-sdk";
import { logger } from "../../../logger";

export const changeTerminationProtection = async (
  instanceId: string,
  value: string
) => {
  const ec2 = new EC2();
  const params = {
    Attribute: "disableApiTermination",
    InstanceId: instanceId,
    Value: value
  };
  try {
    await ec2.modifyInstanceAttribute(params).promise();
  } catch (error) {
    logger.error(error.message);
  }
  logger.info(`Changed termination protection to ${value} for ${instanceId}.`);
};
