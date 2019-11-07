import { identifyInstance } from "../modules/inquiry/inquireEC2Instances";
import { inquireConfirmationStep } from "../modules/inquiry/inquireConfirmationStep";
import { logger } from "../logger";
import { getRunbookList } from "../modules/runbook/runbookList";

export const handler = async (): Promise<void> => {
  try {
    const instanceId = await identifyInstance();
    const runbook = getRunbookList();

    for (const step of runbook) {
      logger.info(await step.describeAction(instanceId));
    }

    const proceed = await inquireConfirmationStep();
    if (!proceed) {
      return;
    }

    for (const step of runbook) {
      await step.run(instanceId);
    }
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
