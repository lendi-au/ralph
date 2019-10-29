import { changeShutdownBehavior } from "./sub-modules/changeShutdownBehavior";
import { RunbookStep } from "../../RunbookStep";
import { logger } from "../../../logger";
import { describeShutdownProtection } from "./sub-modules/describeShutdownBehavior";

export class SetShutdownBehaviorToStop extends RunbookStep {
  async describeAction(instanceId: string): Promise<void> {
    const currentValue = await describeShutdownProtection(instanceId);
    const targetValue = "stop";

    if (currentValue === targetValue) {
      logger.info(
        `setShutdownBehaviorToTerminate: No changes since the attribute instanceInitiatedShutdownBehavior is already set to '${currentValue}' for ${instanceId}.`
      );
    } else {
      logger.info(
        `setShutdownBehaviorToTerminate: The attribute instanceInitiatedShutdownBehavior will be changed from '${currentValue}' to '${targetValue}' for ${instanceId}.`
      );
    }
  }

  run(instanceId: string): Promise<void> {
    return changeShutdownBehavior(instanceId, "stop");
  }
}
