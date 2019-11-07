import { SetShutdownBehaviorToStop } from "./SetShutdownBehaviorToStop";
import * as changeShutdownBehavior from "./sub-modules/changeShutdownBehavior";
import * as describeShutdownProtection from "./sub-modules/describeShutdownBehavior";
import * as sinon from "sinon";

describe("SetShutdownBehaviorToStop.describeAction()", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should identify if instanceInitiatedShutdownBehavior attribute is set to stop", async () => {
    const instanceId = "i-1234567890abcdef0";
    const shutdownProtectionState = "stop";

    const expectedOutput = `setShutdownBehaviorToTerminate: No changes since the attribute instanceInitiatedShutdownBehavior is already set to '${shutdownProtectionState}' for ${instanceId}.`;
    const spyDescribeShutdownProtection = sinon.stub(describeShutdownProtection, "describeShutdownProtection");
    spyDescribeShutdownProtection.resolves(shutdownProtectionState);

    const setShutdownBehaviorToStop = new SetShutdownBehaviorToStop();
    const actualOutput = await setShutdownBehaviorToStop.describeAction(instanceId);
    expect(actualOutput).toBe(expectedOutput);
  });

  it("should identify if instanceInitiatedShutdownBehavior attribute is set to terminate", async () => {
    const instanceId = "i-1234567890abcdef0";
    const shutdownProtectionState = "terminate";
    const expectedOutput = `setShutdownBehaviorToTerminate: The attribute instanceInitiatedShutdownBehavior will be changed from '${shutdownProtectionState}' to 'stop' for ${instanceId}.`;
    const spyDescribeShutdownProtection = sinon.stub(describeShutdownProtection, "describeShutdownProtection");
    spyDescribeShutdownProtection.resolves(shutdownProtectionState);

    const setShutdownBehaviorToStop = new SetShutdownBehaviorToStop();
    const actualOutput = await setShutdownBehaviorToStop.describeAction(instanceId);
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe("SetShutdownBehaviorToStop.run()", () => {
  it("should call changeShutdownBehavior(instanceId)", async () => {
    const instanceId = "i-1234567890abcdef0";
    const runbookStep = new SetShutdownBehaviorToStop();

    const spyChangeShutdownBehavior = sinon.stub(changeShutdownBehavior, "changeShutdownBehavior");
    spyChangeShutdownBehavior.resolves();

    await runbookStep.run(instanceId);

    expect(spyChangeShutdownBehavior.calledOnce).toBe(true);
  });
});
