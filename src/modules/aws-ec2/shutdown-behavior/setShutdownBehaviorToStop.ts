import { changeShutdownBehavior } from "./sub-modules/changeShutdownBehavior";
import { RunbookStep } from "../../runbook/RunbookStep";
import { describeShutdownProtection } from "./sub-modules/describeShutdownBehavior";

export class SetShutdownBehaviorToStop extends RunbookStep {
  readonly targetValue = "stop";

  async describeAction(instanceId: string): Promise<string> {
    const currentValue = await describeShutdownProtection(instanceId);

    if (currentValue === this.targetValue) {
      return `setShutdownBehaviorToTerminate: No changes since the attribute instanceInitiatedShutdownBehavior is already set to '${currentValue}' for ${instanceId}.`;
    } else {
      return `setShutdownBehaviorToTerminate: The attribute instanceInitiatedShutdownBehavior will be changed from '${currentValue}' to '${this.targetValue}' for ${instanceId}.`;
    }
  }

  run(instanceId: string): Promise<void> {
    return changeShutdownBehavior(instanceId, this.targetValue);
  }
}
