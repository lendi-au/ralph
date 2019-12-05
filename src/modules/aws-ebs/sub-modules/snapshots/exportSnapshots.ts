import { EbsConfig } from "../config/EbsConfig";
import { describeSnapshotIds } from "./describeSnapshots";
import { createSnapshot } from "./createSnapshot";
import { copySnapshotToTargetRegion } from "./copySnapshotToTargetRegion";
import { shareSnapshot } from "./shareSnapshot";
import { isSnapshotInTargetRegion } from "./isSnapshotInTargetRegion";
import { waitForSnapshotCompletion } from "./waitForSnapshotCompletion";
import { describeVolumes } from "../volumes/describeVolumes";
import { logger } from "../../../../logger";

export const exportSnapshotToTargetAwsAccount = async (
  config: EbsConfig,
  snapshot: string | undefined,
): Promise<void> => {
  if (!snapshot) {
    return;
  }

  if (!isSnapshotInTargetRegion(config)) {
    snapshot = await copySnapshotToTargetRegion(config, snapshot);
  }

  if (config.targetAwsAccounts) {
    await shareSnapshot(config, snapshot);
  }
};

export const exportSnapshotsToTargetAwsAccount = async (
  config: EbsConfig,
  snapshots: (string | undefined)[],
): Promise<void> => {
  for (const snapshot of snapshots) {
    await exportSnapshotToTargetAwsAccount(config, snapshot);
  }
};

export const exportSnapshotsFromVolumes = async (config: EbsConfig, volumes: string[]): Promise<void> => {
  for (const volume of volumes) {
    const latestSnapshotId = await createSnapshot(volume);

    await waitForSnapshotCompletion(latestSnapshotId);

    const snapshotsToExport = config.transferAllSnapshots ? await describeSnapshotIds(volume) : [latestSnapshotId];
    await exportSnapshotsToTargetAwsAccount(config, snapshotsToExport);
  }
};

export const exportSnapshotsFromInstance = async (config: EbsConfig, instanceId: string): Promise<void> => {
  const volumes = await describeVolumes(instanceId);
  logger.info(`Exporting snapshots from instance: ${instanceId}`);
  await exportSnapshotsFromVolumes(config, volumes);
};
