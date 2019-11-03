import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { describeShutdownProtection } from "./describeShutdownBehavior";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("describeShutdownProtection()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
  });

  it("should call aws-sdk EC2 with the correct params built from instanceId and return shutdown behavior", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "instanceInitiatedShutdownBehavior",
      InstanceId: instanceId
    };

    const describeInstanceAttributeSpy = sinon.stub();
    describeInstanceAttributeSpy.resolves({
      InstanceInitiatedShutdownBehavior: {
        Value: "stop"
      }
    });
    AWSMock.mock(
      "EC2",
      "describeInstanceAttribute",
      describeInstanceAttributeSpy
    );

    let shutdownBehavior = await describeShutdownProtection(instanceId);

    expect(describeInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );
    expect(shutdownBehavior).toEqual("stop");
  });

  it("should early return if describe has no return value", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "instanceInitiatedShutdownBehavior",
      InstanceId: instanceId
    };

    const describeInstanceAttributeSpy = sinon.stub();
    describeInstanceAttributeSpy.resolves({
      InstanceInitiatedShutdownBehavior: ""
    });

    AWSMock.mock(
      "EC2",
      "describeInstanceAttribute",
      describeInstanceAttributeSpy
    );

    let shutdownBehavior = await describeShutdownProtection(instanceId);

    expect(describeInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );
    expect(shutdownBehavior).toBeUndefined();
  });
});
