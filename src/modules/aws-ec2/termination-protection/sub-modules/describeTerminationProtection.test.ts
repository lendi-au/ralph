import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { describeTerminationProtection } from "./describeTerminationProtection";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("describeTerminationProtection()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
  });

  it("should call aws-sdk EC2 with the correct params built from instanceId and return termination protection value", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "disableApiTermination",
      InstanceId: instanceId,
    };

    const spyDescribeInstanceAttribute = sinon.stub();
    spyDescribeInstanceAttribute.resolves({
      DisableApiTermination: {
        Value: "stop",
      },
    });
    AWSMock.mock("EC2", "describeInstanceAttribute", spyDescribeInstanceAttribute);

    const terminationProtection = await describeTerminationProtection(instanceId);
    expect(spyDescribeInstanceAttribute.calledOnceWith(expectedParams)).toBe(true);
    expect(terminationProtection).toEqual("stop");
  });

  it("should early return if describe has no return value", async () => {
    const instanceId = "i-1234567890abcdef0";
    const expectedParams = {
      Attribute: "disableApiTermination",
      InstanceId: instanceId,
    };

    const spyDescribeInstanceAttribute = sinon.stub();
    spyDescribeInstanceAttribute.resolves({
      DisableApiTermination: "",
    });
    AWSMock.mock("EC2", "describeInstanceAttribute", spyDescribeInstanceAttribute);

    const terminationProtection = await describeTerminationProtection(instanceId);
    expect(spyDescribeInstanceAttribute.calledOnceWith(expectedParams)).toBe(true);
    expect(terminationProtection).toBeUndefined();
  });
});
