import { removeIamInstanceProfile } from "../modules/aws-ec2/iam-instance-profile/removeIamInstanceProfile";
import { setShutdownBehaviorToTerminate } from "../modules/aws-ec2/shutdown-behavior/setShutdownBehaviorToTerminate";
import { enableTerminationProtection } from "../modules/aws-ec2/termination-protection/enableTerminationProtection";
import { identifyInstance } from "../modules/inquireEC2Instances";

export const runbook = [
  removeIamInstanceProfile,
  setShutdownBehaviorToTerminate,
  enableTerminationProtection
];

export const handler = async () => {
  const instanceId = await identifyInstance();

  for (const executeOperation of runbook) {
    executeOperation(instanceId);
  }
};
