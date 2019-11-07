import { RunbookStep } from "../../runbook/RunbookStep";
import { describeTerminationProtection } from "./sub-modules/describeTerminationProtection";
import { changeTerminationProtection } from "./sub-modules/changeTerminationProtection";

export class EnableTerminationProtection extends RunbookStep {
  readonly targetValue = true;

  async describeAction(instanceId: string): Promise<string> {
    const currentValue = await describeTerminationProtection(instanceId);
    if (currentValue === this.targetValue) {
      return `enableTerminationProtection: No changes since the attribute disableApiTermination is already set to ${currentValue} for ${instanceId}.`;
    } else {
      return `enableTerminationProtection: The attribute disableApiTermination will be changed from ${currentValue} to ${this.targetValue} for ${instanceId}.`;
    }
  }

  run(instanceId: string): Promise<void> | void {
    return changeTerminationProtection(instanceId, this.targetValue.toString());
  }
}
