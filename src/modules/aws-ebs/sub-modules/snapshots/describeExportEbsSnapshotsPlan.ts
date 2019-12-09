import { describeSnapshotIds } from "./describeSnapshots";
import { describeVolumes } from "../volumes/describeVolumes";
import { EbsConfig } from "../config/EbsConfig";

export const describeExportEbsSnapshotsPlan = async (config: EbsConfig, instanceId: string): Promise<string> => {
  let message = config.transferAllSnapshots ? `All snapshots ` : `Latest snapshots `;
  message += `from the EBS volumes attached to instance ${instanceId} will be exported to quarantine accounts.\n`;

  if (config.sourceAwsRegion !== config.quarantineAwsRegion) {
    message += `These snapshots will first be copied to this region first: ${config.quarantineAwsRegion}\n`;
  }

  const volumes = await describeVolumes(instanceId);

  if (volumes.length === 0) {
    return `${instanceId}: Instance has no volumes. No action will be taken.`;
  }

  message += `Volumes: ${volumes}\n`;

  for (const volume of volumes) {
    message += `${volume}:\n`;
    message += `  - Ralph will create a latest snapshot out of this volume.\n`;

    if (config.transferAllSnapshots) {
      const snapshots = await describeSnapshotIds(volume);
      snapshots.forEach((snapshot: string) => {
        if (snapshot) {
          message += `  - ${snapshot}\n`;
        }
      });
    }
  }

  message += `All copied snapshots will then be exported to quarantine AWS Accounts: ${config.quarantineAwsAccounts}.`;
  return message;
};
