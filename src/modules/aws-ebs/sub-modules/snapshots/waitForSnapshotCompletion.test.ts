// test sleep -> setTimeout was called?

// wait 4 completion
// checkSnapshotProgress was called on snapshotid params
// isSnapshotInCompletedState

import * as sinon from "sinon";
import * as isSnapshotInCompletedState from "./isSnapshotInCompletedState";
import * as waitForSnapshotCompletion from "./waitForSnapshotCompletion";
import * as extractSnapshotProgress from "./extractSnapshotProgress";
import * as checkSnapshotProgress from "./checkSnapshotProgress";

describe("waitForSnapshotCompletion()", () => {
  it("should poll until snapshot is completed", async () => {
    const snapshotId = "snap-001";

    // Mock setTimeout
    const spySleep = sinon.stub(waitForSnapshotCompletion, "sleep");
    spySleep.resolves();

    // Mock completion of snapshot creation on third call
    const spyIsSnapshotInCompletedState = sinon.stub(isSnapshotInCompletedState, "isSnapshotInCompletedState");
    spyIsSnapshotInCompletedState.onFirstCall().returns(false);
    spyIsSnapshotInCompletedState.onSecondCall().returns(false);
    spyIsSnapshotInCompletedState.onThirdCall().returns(true);

    const snapshotProgress1 = {
      state: "pending",
      progress: "0%",
      volumeSize: 8,
    };

    const snapshotProgress2 = {
      state: "pending",
      progress: "75%",
      volumeSize: 8,
    };

    const snapshotProgress3 = {
      state: "completed",
      progress: "100%",
      volumeSize: 8,
    };

    const spyCheckSnapshotProgress = sinon.stub(checkSnapshotProgress, "checkSnapshotProgress");
    spyCheckSnapshotProgress
      .withArgs(snapshotId)
      .onFirstCall()
      .resolves(snapshotProgress1);
    spyCheckSnapshotProgress
      .withArgs(snapshotId)
      .onSecondCall()
      .resolves(snapshotProgress2);
    spyCheckSnapshotProgress
      .withArgs(snapshotId)
      .onThirdCall()
      .resolves(snapshotProgress3);

    const spyExtractSnapshotProgress = sinon.stub(extractSnapshotProgress, "extractSnapshotProgress");
    spyExtractSnapshotProgress.withArgs(snapshotProgress1.progress).returns(0);
    spyExtractSnapshotProgress.withArgs(snapshotProgress2.progress).returns(75);

    await waitForSnapshotCompletion.waitForSnapshotCompletion(snapshotId);

    expect(spyCheckSnapshotProgress.calledThrice).toBe(true);
    expect(spyIsSnapshotInCompletedState.calledThrice).toBe(true);
    expect(spyExtractSnapshotProgress.calledTwice).toBe(true);
  });
});
