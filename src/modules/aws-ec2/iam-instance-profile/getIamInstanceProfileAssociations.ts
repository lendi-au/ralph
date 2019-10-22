import { EC2 } from "aws-sdk";
export const getIamInstanceProfileAssociations = async (instanceId: string) => {
  const ec2 = new EC2();
  const params = {
    Filters: [
      {
        Name: "instance-id",
        Values: [instanceId]
      }
    ]
  };
  const responseData = await ec2
    .describeIamInstanceProfileAssociations(params)
    .promise();
  return responseData;
};
