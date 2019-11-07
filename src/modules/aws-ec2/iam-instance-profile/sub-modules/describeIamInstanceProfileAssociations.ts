import { EC2 } from "aws-sdk";
import { IamInstanceProfileAssociation } from "aws-sdk/clients/ec2";

export const describeIamInstanceProfileAssociations = async (
  instanceId: string,
): Promise<void | IamInstanceProfileAssociation[]> => {
  const ec2 = new EC2();
  const params = {
    Filters: [
      {
        Name: "instance-id",
        Values: [instanceId],
      },
    ],
  };
  const response = await ec2.describeIamInstanceProfileAssociations(params).promise();

  if (!response.IamInstanceProfileAssociations) {
    return;
  }
  return response.IamInstanceProfileAssociations;
};
