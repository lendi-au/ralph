import { RemoveIamInstanceProfile } from "../aws-ec2/iam-instance-profile/RemoveIamInstanceProfile";
import { SetShutdownBehaviorToStop } from "../aws-ec2/shutdown-behavior/SetShutdownBehaviorToStop";
import { EnableTerminationProtection } from "../aws-ec2/termination-protection/EnableTerminationProtection";
import { RunbookStep } from "./RunbookStep";

export const getRunbookList = (): Array<RunbookStep> => {
  return [
    new RemoveIamInstanceProfile(),
    new SetShutdownBehaviorToStop(),
    new EnableTerminationProtection()
  ];
};
