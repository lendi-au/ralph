import { describeSnapshotIds } from "./describeSnapshots";
import { describeVolumes } from "../volumes/describeVolumes";

export const describeExportEbsSnapshotsPlan = async (
  targetAwsAccounts: string[],
  targetAwsRegion: string,
  instanceId: string,
): Promise<string> => {
  let message = `Snapshots of the EBS volumes attached to this instance ${instanceId} will be exported to audit account: \n`;

  if (process.env.AWS_REGION !== targetAwsRegion) {
    message += `- These snapshots will be copied to this region first: ${targetAwsRegion} \n`;
  }

  const volumes = await describeVolumes(instanceId);
  message += `Volumes: ${volumes} \n`;

  for (const volume of volumes) {
    message += `${volume}: \n`;

    const snapshots = await describeSnapshotIds(volume);
    snapshots.forEach((snapshot: string | undefined) => {
      if (snapshot) {
        message += `  - ${snapshot}\n`;
      }
    });
  }

  message += `Copied snapshots will then be exported to AWS Accounts: ${targetAwsAccounts}.`;
  return message;
};
