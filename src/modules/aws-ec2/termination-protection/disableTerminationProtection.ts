import { logger } from "../../../logger";
import { RunbookStep } from "../../RunbookStep";
import { changeTerminationProtection } from "./sub-modules/changeTerminationProtection";
import { describeTerminationProtection } from "./sub-modules/describeTerminationProtection";

export class DisableTerminationProtection extends RunbookStep {
  readonly targetValue = false;

  async describeAction(instanceId: string): Promise<void> {
    const currentValue = await describeTerminationProtection(instanceId);

    if (currentValue === this.targetValue) {
      logger.info(
        `disableTerminationProtection: NO CHANGES. Attribute disableApiTermination is already set to '${currentValue}' for ${instanceId}.`
      );
    } else {
      logger.info(
        `disableTerminationProtection: The attribute disableApiTermination will be changed from '${currentValue}' to '${this.targetValue}' for ${instanceId}.`
      );
    }
  }

  run(instanceId: string): Promise<void> | void {
    return changeTerminationProtection(instanceId, this.targetValue.toString());
  }
}
