import { SnapshotState } from "./SnapshotState";

export const isSnapshotInCompletedState = (state: SnapshotState): boolean => {
  return state === SnapshotState.COMPLETED;
};
