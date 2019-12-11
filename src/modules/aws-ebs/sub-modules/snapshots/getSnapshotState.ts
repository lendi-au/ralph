import { SnapshotState } from "./SnapshotState";

export const getSnapshotState = (state: string): SnapshotState => {
  const snapshotStateKey = Object.keys(SnapshotState).find(key => {
    return SnapshotState[key as keyof typeof SnapshotState] === state;
  });

  if (!snapshotStateKey) {
    throw new Error(`${state} is not a valid Snapshot state.`);
  }

  const returnState: SnapshotState = SnapshotState[snapshotStateKey as keyof typeof SnapshotState];
  return returnState;
};
