import { handler } from "../execute";
import * as inquireEC2Instances from "../../modules/inquiry/inquireEC2Instances";
import * as inquireConfirmationStep from "../../modules/inquiry/inquireConfirmationStep";
import * as getRunbookList from "../../modules/runbook/runbookList";
import { RunbookStep } from "../../modules/runbook/RunbookStep";
import * as sinon from "sinon";

class testRunBook extends RunbookStep {
  async describeAction(instanceId: string): Promise<void> {
    return Promise.resolve();
  }

  run(instanceId: string): Promise<void> {
    return Promise.resolve();
  }
}

describe("handler()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should run all runbooks given right instance ID and user confirmed action", async () => {
    const instanceId = "i-1234567890abcdef0";
    const spyIdentifyInstance = sinon.stub(
      inquireEC2Instances,
      "identifyInstance"
    );

    spyIdentifyInstance.resolves(instanceId);

    const spyinquireConfirmationStep = sinon.stub(
      inquireConfirmationStep,
      "inquireConfirmationStep"
    );
    spyinquireConfirmationStep.resolves(true);

    const sampleTestRunbook = new testRunBook();
    const spySampleRunbookDescribeAction = sinon.stub(
      sampleTestRunbook,
      "describeAction"
    );
    const spySampleRunbookRun = sinon.stub(sampleTestRunbook, "run");
    const spyGetRunbookList = sinon.stub(getRunbookList, "getRunbookList");

    spyGetRunbookList.returns([
      sampleTestRunbook,
      sampleTestRunbook,
      sampleTestRunbook
    ]);

    await handler();

    expect(
      spySampleRunbookDescribeAction.withArgs(instanceId).calledThrice
    ).toBe(true);
    expect(spySampleRunbookRun.withArgs(instanceId).calledThrice).toBe(true);
  });

  it("should not execute the runbook if the user did not confirm the action", async () => {
    const instanceId = "i-1234567890abcdef0";
    const spyIdentifyInstance = sinon.stub(
      inquireEC2Instances,
      "identifyInstance"
    );
    spyIdentifyInstance.resolves(instanceId);

    const spyinquireConfirmationStep = sinon.stub(
      inquireConfirmationStep,
      "inquireConfirmationStep"
    );
    spyinquireConfirmationStep.resolves(false);

    const sampleTestRunbook = new testRunBook();
    const spySampleRunbookDescribeAction = sinon.stub(
      sampleTestRunbook,
      "describeAction"
    );

    const spySampleRunbookRun = sinon.stub(sampleTestRunbook, "run");
    const spyGetRunbookList = sinon.stub(getRunbookList, "getRunbookList");
    spyGetRunbookList.returns([
      sampleTestRunbook,
      sampleTestRunbook,
      sampleTestRunbook
    ]);

    await handler();

    expect(
      spySampleRunbookDescribeAction.withArgs(instanceId).calledThrice
    ).toBe(true);
    expect(spySampleRunbookRun.withArgs(instanceId).notCalled).toBe(true);
  });
});
