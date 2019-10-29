import { EC2 } from "aws-sdk";
export const describeIamInstanceProfileAssociations = (instanceId: string) => {
  const ec2 = new EC2();
  const params = {
    Filters: [
      {
        Name: "instance-id",
        Values: [instanceId]
      }
    ]
  };
  return ec2.describeIamInstanceProfileAssociations(params).promise();
};
