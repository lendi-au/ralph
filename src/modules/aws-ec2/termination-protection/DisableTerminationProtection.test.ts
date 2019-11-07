import { DisableTerminationProtection } from "./DisableTerminationProtection";
import * as changeTerminationProtection from "./sub-modules/changeTerminationProtection";
import * as describeTerminationProtection from "./sub-modules/describeTerminationProtection";
import * as sinon from "sinon";

describe("DisableTerminationProtection.describeAction()", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should identify if describeTerminationProtection attribute is set to false", async () => {
    const instanceId = "i-1234567890abcdef0";
    const currentValue = false;
    const expectedOutput = `disableTerminationProtection: No changes since the attribute disableApiTermination is already set to '${currentValue}' for ${instanceId}.`;
    const spyDescribeTerminationProtection = sinon.stub(describeTerminationProtection, "describeTerminationProtection");
    spyDescribeTerminationProtection.resolves(currentValue);
    const disableTerminationProtection = new DisableTerminationProtection();
    const actualOutput = await disableTerminationProtection.describeAction(instanceId);
    expect(actualOutput).toBe(expectedOutput);
  });
  it("should identify if describeTerminationProtection attribute is set to true", async () => {
    const instanceId = "i-1234567890abcdef0";
    const currentValue = true;
    const expectedOutput = `disableTerminationProtection: The attribute disableApiTermination will be changed from '${currentValue}' to 'false' for ${instanceId}.`;
    const spyDescribeTerminationProtection = sinon.stub(describeTerminationProtection, "describeTerminationProtection");
    spyDescribeTerminationProtection.resolves(currentValue);
    const disableTerminationProtection = new DisableTerminationProtection();
    const actualOutput = await disableTerminationProtection.describeAction(instanceId);
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe("DisableTerminationProtection.run()", () => {
  it("should call changeTerminationProtection(instanceId)", async () => {
    const instanceId = "i-1234567890abcdef0";
    const runbookStep = new DisableTerminationProtection();
    const spyChangeShutdownBehavior = sinon.stub(changeTerminationProtection, "changeTerminationProtection");
    spyChangeShutdownBehavior.resolves();

    await runbookStep.run(instanceId); // add with args to all...

    expect(spyChangeShutdownBehavior.calledOnce).toBe(true);
  });
});
