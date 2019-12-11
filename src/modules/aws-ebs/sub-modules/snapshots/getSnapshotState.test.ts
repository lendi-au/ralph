import { SnapshotState } from "./SnapshotState";
import { getSnapshotState } from "./getSnapshotState";

describe("getSnapshotState()", () => {
  it("should get snapshot state if it is valid", () => {
    [
      ["completed", SnapshotState.COMPLETED],
      ["pending", SnapshotState.PENDING],
      ["error", SnapshotState.ERROR],
    ].forEach(state => {
      expect(getSnapshotState(state[0])).toEqual(state[1]);
    });
  });

  it("should get throw an error if snapshot state is invalid", () => {
    ["solid", "new york", "happy"].forEach(state => {
      expect(() => {
        getSnapshotState(state);
      }).toThrow(`${state} is not a valid Snapshot state.`);
    });
  });
});
