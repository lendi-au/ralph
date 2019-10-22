import { EC2 } from "aws-sdk";
import { logger } from "../../../logger";
import { getIamInstanceProfileAssociations } from "./getIamInstanceProfileAssociations";

export const removeIamInstanceProfile = async (instanceId: string) => {
  const ec2 = new EC2();
  try {
    const responseData = await getIamInstanceProfileAssociations(instanceId);
    if (!responseData.IamInstanceProfileAssociations) {
      return;
    }
    const profileAssociations = responseData.IamInstanceProfileAssociations;
    profileAssociations.forEach(async association => {
      const associationId = association.AssociationId || "";
      const params = {
        AssociationId: associationId
      };
      await ec2.disassociateIamInstanceProfile(params).promise();
    });
  } catch (error) {
    logger.error(error.message);
  }
  logger.info(`Removed IAM Instance Profile for ${instanceId}.`);
};
