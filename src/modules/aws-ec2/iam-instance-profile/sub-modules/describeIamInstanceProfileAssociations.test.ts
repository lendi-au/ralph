import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { describeIamInstanceProfileAssociations } from "./describeIamInstanceProfileAssociations";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("describeIamInstanceProfileAssociations()", () => {
  it("should call aws-sdk EC2 with the correct params built from instanceId", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Filters: [
        {
          Name: "instance-id",
          Values: [instanceId]
        }
      ]
    };

    const describeIamInstanceProfileAssociationsSpy = sinon.stub();
    describeIamInstanceProfileAssociationsSpy.resolves("");
    AWSMock.mock(
      "EC2",
      "describeIamInstanceProfileAssociations",
      describeIamInstanceProfileAssociationsSpy
    );

    await describeIamInstanceProfileAssociations(instanceId);

    expect(
      describeIamInstanceProfileAssociationsSpy.calledOnceWith(expectedParams)
    ).toBe(true);

    AWSMock.restore("EC2");
  });
});
