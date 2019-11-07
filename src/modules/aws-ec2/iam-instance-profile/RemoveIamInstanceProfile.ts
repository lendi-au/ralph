import { RunbookStep } from "../../runbook/RunbookStep";
import { diassociateIamInstanceProfile } from "./sub-modules/diassociateIamInstanceProfile";
import { describeIamInstanceProfileAssociations } from "./sub-modules/describeIamInstanceProfileAssociations";

export class RemoveIamInstanceProfile extends RunbookStep {
  async describeAction(instanceId: string): Promise<string> {
    const iamInstanceProfileAssociations = await describeIamInstanceProfileAssociations(
      instanceId
    );

    if (
      iamInstanceProfileAssociations &&
      iamInstanceProfileAssociations.length !== 0
    ) {
      const profileAssociations = iamInstanceProfileAssociations
        .map(IamInstanceProfileAssociations => {
          if (!IamInstanceProfileAssociations.IamInstanceProfile) {
            return;
          }
          return IamInstanceProfileAssociations.IamInstanceProfile.Arn;
        })
        .join(", ");
      return `RemoveIamInstanceProfile: This will disassociate the following Iam Instance Profiles: ['${profileAssociations}'] for ${instanceId}`;
    } else {
      return "RemoveIamInstanceProfile: No changes since there are no Iam Instance Profile Associations to disassociate.";
    }
  }

  run(instanceId: string): Promise<void> {
    return diassociateIamInstanceProfile(instanceId);
  }
}
