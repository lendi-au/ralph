import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import { changeShutdownBehavior } from "./changeShutdownBehavior";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("changeShutdownBehavior()", () => {
  it("should call aws-sdk EC2 with the correct params built from instanceId and value", async () => {
    const instanceId = "i-1234567890abcdef0";
    const targetValue = "true";
    const expectedParams = {
      Attribute: "instanceInitiatedShutdownBehavior",
      InstanceId: instanceId,
      Value: targetValue
    };

    const modifyInstanceAttributeSpy = sinon.stub();
    modifyInstanceAttributeSpy.resolves("");
    AWSMock.mock("EC2", "modifyInstanceAttribute", modifyInstanceAttributeSpy);

    await changeShutdownBehavior(instanceId, targetValue);

    expect(modifyInstanceAttributeSpy.calledOnceWith(expectedParams)).toBe(
      true
    );

    AWSMock.restore("EC2");
  });
});
