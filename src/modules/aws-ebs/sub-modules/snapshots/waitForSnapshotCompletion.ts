import { Presets, Bar } from "cli-progress";
import { isSnapshotInCompletedState } from "./isSnapshotInCompletedState";
import { checkSnapshotProgress } from "./checkSnapshotProgress";
import { extractSnapshotProgress } from "./extractSnapshotProgress";

export const sleep = async (timer: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timer));
};

export const waitForSnapshotCompletion = async (SnapshotId: string): Promise<void> => {
  let snapshotProgress = await checkSnapshotProgress(SnapshotId);
  // console.log(`Size: ${snapshotProgress.volumeSize} GiB`);
  const progressBar = new Bar({}, Presets.shades_classic);
  progressBar.start(100, 0);
  while (!isSnapshotInCompletedState(snapshotProgress.state)) {
    await sleep(2000);
    progressBar.update(extractSnapshotProgress(snapshotProgress.progress));
    snapshotProgress = await checkSnapshotProgress(SnapshotId);
  }
  progressBar.update(100);
  progressBar.stop();
};
