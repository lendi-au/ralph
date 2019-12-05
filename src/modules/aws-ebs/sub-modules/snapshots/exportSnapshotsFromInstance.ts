import { EbsConfig } from "../loadEbsConfig";
import { describeVolumes } from "../volumes/describeVolumes";
import { exportSnapshotsFromVolumes } from "./exportSnapshots";

export const exportSnapshotsFromInstance = async (config: EbsConfig, instanceId: string): Promise<void> => {
  const volumes = await describeVolumes(instanceId);
  await exportSnapshotsFromVolumes(config, volumes);
};
