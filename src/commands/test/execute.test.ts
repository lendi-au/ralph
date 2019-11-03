import { handler } from "../execute";
import * as inquireEC2Instances from "../../modules/inquiry/inquireEC2Instances";
import * as inquireConfirmationStep from "../../modules/inquiry/inquireConfirmationStep";
import * as getRunbookList from "../../modules/runbook/runbookList";
import { RunbookStep } from "../../modules/runbook/RunbookStep";

class testRunBook extends RunbookStep {
  async describeAction(instanceId: string): Promise<void> {
    return Promise.resolve();
  }

  run(instanceId: string): Promise<void> {
    return Promise.resolve();
  }
}

describe("handler()", () => {
  it("should run all runbooks given right instance ID and user confirmed action", async () => {
    const spyIdentifyInstance = jest.spyOn(
      inquireEC2Instances,
      "identifyInstance"
    );
    spyIdentifyInstance.mockReturnValue(Promise.resolve("topher"));

    const spyinquireConfirmationStep = jest.spyOn(
      inquireConfirmationStep,
      "inquireConfirmationStep"
    );
    spyinquireConfirmationStep.mockReturnValue(Promise.resolve(true));

    const sampleTestRunbook = new testRunBook();
    const spySampleRunbookDescribeAction = jest.spyOn(
      sampleTestRunbook,
      "describeAction"
    );
    const spySampleRunbookRun = jest.spyOn(sampleTestRunbook, "run");

    const spyGetRunbookList = jest.spyOn(getRunbookList, "getRunbookList");
    spyGetRunbookList.mockReturnValue([
      sampleTestRunbook,
      sampleTestRunbook,
      sampleTestRunbook
    ]);

    await handler();
    expect(spySampleRunbookDescribeAction.mock.calls.length).toBe(3);
    expect(spySampleRunbookRun.mock.calls.length).toBe(3);

    spyIdentifyInstance.mockReset();
    spyinquireConfirmationStep.mockReset();
    spySampleRunbookDescribeAction.mockReset();
    spySampleRunbookRun.mockReset();
  });

  it("should not execute the runbook if the user did not confirm the action", async () => {
    const spyIdentifyInstance = jest.spyOn(
      inquireEC2Instances,
      "identifyInstance"
    );
    spyIdentifyInstance.mockReturnValue(Promise.resolve("topher"));

    const spyinquireConfirmationStep = jest.spyOn(
      inquireConfirmationStep,
      "inquireConfirmationStep"
    );
    spyinquireConfirmationStep.mockReturnValue(Promise.resolve(false));

    const sampleTestRunbook = new testRunBook();
    const spySampleRunbookDescribeAction = jest.spyOn(
      sampleTestRunbook,
      "describeAction"
    );
    const spySampleRunbookRun = jest.spyOn(sampleTestRunbook, "run");

    const spyGetRunbookList = jest.spyOn(getRunbookList, "getRunbookList");
    spyGetRunbookList.mockReturnValue([
      sampleTestRunbook,
      sampleTestRunbook,
      sampleTestRunbook
    ]);

    await handler();
    expect(spySampleRunbookDescribeAction.mock.calls.length).toBe(3);
    expect(spySampleRunbookRun.mock.calls.length).toBe(0);

    spyIdentifyInstance.mockReset();
    spyinquireConfirmationStep.mockReset();
    spySampleRunbookDescribeAction.mockReset();
    spySampleRunbookRun.mockReset();
  });
});
