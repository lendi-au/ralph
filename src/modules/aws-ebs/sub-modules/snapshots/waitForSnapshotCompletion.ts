import { Presets, Bar } from "cli-progress";
import { isSnapshotInCompletedState } from "./isSnapshotInCompletedState";
import { checkSnapshotProgress } from "./checkSnapshotProgress";
import { extractSnapshotProgress } from "./extractSnapshotProgress";
import { logger } from "../../../../logger";
import { SnapshotState } from "./SnapshotState";
import { getSnapshotState } from "./getSnapshotState";

export const sleep = async (timer: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timer));
};

export const waitForSnapshotCompletion = async (SnapshotId: string): Promise<void> => {
  let snapshotProgress = await checkSnapshotProgress(SnapshotId);
  let snapshotState: SnapshotState = getSnapshotState(snapshotProgress.state);

  logger.info(`Creating ${SnapshotId} (Size: ${snapshotProgress.volumeSize} GiB):`);
  const progressBar = new Bar({}, Presets.shades_classic);
  progressBar.start(100, 0);

  while (!isSnapshotInCompletedState(snapshotState)) {
    await sleep(2000);
    progressBar.update(extractSnapshotProgress(snapshotProgress.progress));
    snapshotProgress = await checkSnapshotProgress(SnapshotId);
    snapshotState = getSnapshotState(snapshotProgress.state);
  }
  progressBar.update(100);
  progressBar.stop();
};
