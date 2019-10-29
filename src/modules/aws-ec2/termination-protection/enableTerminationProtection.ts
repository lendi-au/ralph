import { logger } from "../../../logger";
import { RunbookStep } from "../../RunbookStep";
import { describeTerminationProtection } from "./sub-modules/describeTerminationProtection";
import { changeTerminationProtection } from "./sub-modules/changeTerminationProtection";

export class enableTerminationProtection extends RunbookStep {
  async describeAction(instanceId: string): Promise<void> {
    const currentValue = await describeTerminationProtection(instanceId);
    const targetValue = true;

    if (currentValue === targetValue) {
      logger.info(
        `enableTerminationProtection: No changes since the attribute disableApiTermination is already set to ${currentValue} for ${instanceId}.`
      );
    } else {
      logger.info(
        `enableTerminationProtection: The attribute disableApiTermination will be changed from ${currentValue} to ${targetValue} for ${instanceId}.`
      );
    }
  }

  run(instanceId: string): Promise<void> | void {
    return changeTerminationProtection(instanceId, "true");
  }
}
