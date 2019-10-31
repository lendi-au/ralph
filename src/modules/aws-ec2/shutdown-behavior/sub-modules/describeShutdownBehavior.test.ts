import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { describeShutdownProtection } from "./describeShutdownBehavior";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("describeShutdownProtection()", () => {
  it("should call aws-sdk EC2 with the correct params built from instanceId", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "instanceInitiatedShutdownBehavior",
      InstanceId: instanceId
    };

    const describeInstanceAttributeSpy = sinon.stub();
    describeInstanceAttributeSpy.resolves("");
    AWSMock.mock(
      "EC2",
      "describeInstanceAttribute",
      describeInstanceAttributeSpy
    );

    await describeShutdownProtection(instanceId);
    expect(describeInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );
    AWSMock.restore("EC2");
  });
});
