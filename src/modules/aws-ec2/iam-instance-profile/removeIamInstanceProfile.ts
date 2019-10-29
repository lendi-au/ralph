import { logger } from "../../../logger";
import { RunbookStep } from "../../RunbookStep";
import { diassociateIamInstanceProfile } from "./sub-modules/diassociateIamInstanceProfile";
import { describeIamInstanceProfileAssociations } from "./sub-modules/describeIamInstanceProfileAssociations";

export class RemoveIamInstanceProfile extends RunbookStep {
  async describeAction(instanceId: string): Promise<void> {
    const currentValue = await describeIamInstanceProfileAssociations(
      instanceId
    );

    if (!currentValue.IamInstanceProfileAssociations) {
      return;
    }

    if (currentValue.IamInstanceProfileAssociations.length !== 0) {
      let profileAssociations = currentValue.IamInstanceProfileAssociations.map(
        IamInstanceProfileAssociations => {
          if (!IamInstanceProfileAssociations.IamInstanceProfile) {
            return "";
          }
          return IamInstanceProfileAssociations.IamInstanceProfile.Arn;
        }
      ).join(", ");
      logger.info(
        `RemoveIamInstanceProfile: This will disassociate the following Iam Instance Profiles: ['${profileAssociations}'] for ${instanceId}`
      );
    } else {
      logger.info(
        "RemoveIamInstanceProfile: No changes since there are no Iam Instance Profile Associations to disassociate."
      );
    }
  }

  run(instanceId: string): Promise<void> {
    return diassociateIamInstanceProfile(instanceId);
  }
}
