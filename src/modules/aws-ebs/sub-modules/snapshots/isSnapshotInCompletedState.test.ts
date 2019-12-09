import { isSnapshotInCompletedState } from "./isSnapshotInCompletedState";

describe("isSnapshotInCompletedState()", () => {
  it("should return true of state is complete", () => {
    expect(isSnapshotInCompletedState("completed")).toBe(true);
  });
  it("should return false of state is not complete", () => {
    ["cmpleted", "pending", ""].forEach(state => {
      expect(isSnapshotInCompletedState(state)).toBe(false);
    });
  });
});
