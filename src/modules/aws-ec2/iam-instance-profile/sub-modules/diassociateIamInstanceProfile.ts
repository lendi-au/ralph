import { EC2 } from "aws-sdk";
import { describeIamInstanceProfileAssociations } from "./describeIamInstanceProfileAssociations";
import { logger } from "../../../../logger";
import { DisassociateIamInstanceProfileRequest } from "aws-sdk/clients/ec2";

export const diassociateIamInstanceProfile = async (instanceId: string) => {
  const ec2 = new EC2();
  const profileAssociations = await describeIamInstanceProfileAssociations(
    instanceId
  );
  if (!profileAssociations) {
    return;
  }
  for (const profileAssociation of profileAssociations) {
    if (!profileAssociation.AssociationId) {
      break;
    }
    const params: DisassociateIamInstanceProfileRequest = {
      AssociationId: profileAssociation.AssociationId
    };
    await ec2.disassociateIamInstanceProfile(params).promise();
  }
  logger.info(`Disassociated IAM Instance Profile for ${instanceId}.`);
};
