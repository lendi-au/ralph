import { removeIamInstanceProfile } from "../modules/aws-ec2/iam-instance-profile/removeIamInstanceProfile";
import { setShutdownBehaviorToStop } from "../modules/aws-ec2/shutdown-behavior/setShutdownBehaviorToStop";
import { enableTerminationProtection } from "../modules/aws-ec2/termination-protection/enableTerminationProtection";
import { identifyInstance } from "../modules/inquiry/inquireEC2Instances";
import { RunbookStep } from "../modules/RunbookStep";
import { inquireConfirmationStep } from "../modules/inquiry/inquireConfirmationStep";

export const runbook: Array<RunbookStep> = [
  new removeIamInstanceProfile(),
  new setShutdownBehaviorToStop(),
  new enableTerminationProtection()
];

export const handler = async () => {
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
};
