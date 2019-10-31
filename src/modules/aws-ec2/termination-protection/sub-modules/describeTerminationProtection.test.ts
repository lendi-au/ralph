import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { describeTerminationProtection } from "./describeTerminationProtection";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("describeTerminationProtection()", () => {
  it("should call aws-sdk EC2 with the correct params built from instanceId", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "disableApiTermination",
      InstanceId: instanceId
    };

    const describeInstanceAttributeSpy = sinon.stub();
    describeInstanceAttributeSpy.resolves("");
    AWSMock.mock(
      "EC2",
      "describeInstanceAttribute",
      describeInstanceAttributeSpy
    );

    await describeTerminationProtection(instanceId);
    expect(describeInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );
    AWSMock.restore("EC2");
  });
});
