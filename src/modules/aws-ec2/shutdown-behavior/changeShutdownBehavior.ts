import { EC2 } from 'aws-sdk';
import { logger } from '../../../logger';

export const changeShutdownBehavior = async (instanceId: string, value: string) => {
  const ec2 = new EC2();
  const params = {
    Attribute: 'instanceInitiatedShutdownBehavior',
    InstanceId: instanceId,
    Value: value,
  };
  try {
    await ec2.modifyInstanceAttribute(params).promise();
  } catch (error) {
    logger.error(error.message);
  }
  logger.info(`Changed shutdown behavior to ${value} for ${instanceId}.`);
};
