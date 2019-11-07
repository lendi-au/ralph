import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { changeTerminationProtection } from "./changeTerminationProtection";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("changeTerminationProtection()", () => {
  it("should call aws-sdk EC2 with the correct params built from instanceId and value", async () => {
    const instanceId = "i-1234567890abcdef0";
    const targetValue = "true";
    const expectedParams = {
      Attribute: "disableApiTermination",
      InstanceId: instanceId,
      Value: targetValue
    };

    const modifyInstanceAttributeSpy = sinon.stub();
    modifyInstanceAttributeSpy.resolves("");
    AWSMock.mock("EC2", "modifyInstanceAttribute", modifyInstanceAttributeSpy);

    await changeTerminationProtection(instanceId, targetValue);

    expect(modifyInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );

    AWSMock.restore("EC2");
  });
});
