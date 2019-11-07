import { handler } from "../execute";
import * as inquireEC2Instances from "../../modules/inquiry/inquireEC2Instances";
import * as inquireConfirmationStep from "../../modules/inquiry/inquireConfirmationStep";
import * as getRunbookList from "../../modules/runbook/runbookList";
import * as sinon from "sinon";
import { RemoveIamInstanceProfile } from "../../modules/aws-ec2/iam-instance-profile/RemoveIamInstanceProfile";

describe("handler()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should run all runbooks given right instance ID and user confirmed action", async () => {
    const instanceId = "i-1234567890abcdef0";
    const spyIdentifyInstance = sinon.stub(inquireEC2Instances, "identifyInstance");

    spyIdentifyInstance.resolves(instanceId);

    const spyinquireConfirmationStep = sinon.stub(inquireConfirmationStep, "inquireConfirmationStep");
    spyinquireConfirmationStep.resolves(true);

    const sampleTestRunbook = new RemoveIamInstanceProfile();
    const spySampleRunbookDescribeAction = sinon.stub(sampleTestRunbook, "describeAction");
    const spySampleRunbookRun = sinon.stub(sampleTestRunbook, "run");
    const spyGetRunbookList = sinon.stub(getRunbookList, "getRunbookList");

    spyGetRunbookList.returns([sampleTestRunbook, sampleTestRunbook, sampleTestRunbook]);

    await handler();

    expect(spySampleRunbookDescribeAction.withArgs(instanceId).calledThrice).toBe(true);
    expect(spySampleRunbookRun.withArgs(instanceId).calledThrice).toBe(true);
  });

  it("should not execute the runbook if the user did not confirm the action", async () => {
    const instanceId = "i-1234567890abcdef0";
    const spyIdentifyInstance = sinon.stub(inquireEC2Instances, "identifyInstance");
    spyIdentifyInstance.resolves(instanceId);

    const spyinquireConfirmationStep = sinon.stub(inquireConfirmationStep, "inquireConfirmationStep");
    spyinquireConfirmationStep.resolves(false);

    const sampleTestRunbook = new RemoveIamInstanceProfile();
    const spySampleRunbookDescribeAction = sinon.stub(sampleTestRunbook, "describeAction");

    const spySampleRunbookRun = sinon.stub(sampleTestRunbook, "run");
    const spyGetRunbookList = sinon.stub(getRunbookList, "getRunbookList");
    spyGetRunbookList.returns([sampleTestRunbook, sampleTestRunbook, sampleTestRunbook]);

    await handler();

    expect(spySampleRunbookDescribeAction.withArgs(instanceId).calledThrice).toBe(true);
    expect(spySampleRunbookRun.withArgs(instanceId).notCalled).toBe(true);
  });
});
