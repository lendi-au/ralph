import { EC2 } from "aws-sdk";
import { describeIamInstanceProfileAssociations } from "./describeIamInstanceProfileAssociations";
import { logger } from "../../../../logger";

export const diassociateIamInstanceProfile = async (instanceId: string) => {
  const ec2 = new EC2();
  const responseData = await describeIamInstanceProfileAssociations(instanceId);
  if (!responseData.IamInstanceProfileAssociations) {
    return;
  }
  const profileAssociations = responseData.IamInstanceProfileAssociations;
  for (const profileAssociation of profileAssociations) {
    const associationId = profileAssociation.AssociationId || "";
    const params = {
      AssociationId: associationId
    };
    await ec2.disassociateIamInstanceProfile(params).promise();
  }
  logger.info(`Disassociated IAM Instance Profile for ${instanceId}.`);
};
