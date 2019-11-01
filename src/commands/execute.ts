import { RemoveIamInstanceProfile } from "../modules/aws-ec2/iam-instance-profile/RemoveIamInstanceProfile";
import { SetShutdownBehaviorToStop } from "../modules/aws-ec2/shutdown-behavior/SetShutdownBehaviorToStop";
import { EnableTerminationProtection } from "../modules/aws-ec2/termination-protection/EnableTerminationProtection";
import { identifyInstance } from "../modules/inquiry/inquireEC2Instances";
import { RunbookStep } from "../modules/RunbookStep";
import { inquireConfirmationStep } from "../modules/inquiry/inquireConfirmationStep";
import { logger } from "../logger";

export const runbook: Array<RunbookStep> = [
  new RemoveIamInstanceProfile(),
  new SetShutdownBehaviorToStop(),
  new EnableTerminationProtection()
];

export const handler = async () => {
  try {
    const instanceId = await identifyInstance();

    for (const step of runbook) {
      await step.describeAction(instanceId);
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
