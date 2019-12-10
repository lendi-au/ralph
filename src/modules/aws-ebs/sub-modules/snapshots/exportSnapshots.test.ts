import * as sinon from "sinon";
import * as describeVolumes from "../volumes/describeVolumes";
import * as exportSnapshots from "./exportSnapshots";
import * as createSnapshot from "./createSnapshot";
import * as waitForSnapshotCompletion from "./waitForSnapshotCompletion";
import * as describeSnapshotIds from "./describeSnapshots";
import * as isSnapshotInQuarantineRegion from "./isSnapshotInQuarantineRegion";
import * as copySnapshotToTargetRegion from "./copySnapshotToTargetRegion";
import * as shareSnapshot from "./shareSnapshot";

describe("exportSnapshotToTargetAwsAccount()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should copy snapshot to quarantine region if snapshot is not in quarantine region", async () => {
    const snapshot = "snap-001";
    const copiedSnapshot = "snap-101";

    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyIsSnapshotInQuarantineRegion = sinon.stub(isSnapshotInQuarantineRegion, "isSnapshotInQuarantineRegion");
    spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).returns(false);

    const spyCopySnapshotToTargetRegion = sinon.stub(copySnapshotToTargetRegion, "copySnapshotToTargetRegion");
    spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).resolves(copiedSnapshot);

    const spyShareSnapshot = sinon.stub(shareSnapshot, "shareSnapshot");
    spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).resolves();

    await exportSnapshots.exportSnapshotToTargetAwsAccount(ebsConfig, snapshot);

    expect(spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).calledOnce).toBe(true);
    expect(spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).calledOnce).toBe(true);
    expect(spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).calledOnce).toBe(true);
  });

  it("should not copy snapshot to quarantine region if snapshot is in quarantine region", async () => {
    const snapshot = "snap-001";
    const copiedSnapshot = snapshot;

    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-1",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyIsSnapshotInQuarantineRegion = sinon.stub(isSnapshotInQuarantineRegion, "isSnapshotInQuarantineRegion");
    spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).returns(true);

    const spyCopySnapshotToTargetRegion = sinon.stub(copySnapshotToTargetRegion, "copySnapshotToTargetRegion");
    spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).resolves(copiedSnapshot);
    const spyShareSnapshot = sinon.stub(shareSnapshot, "shareSnapshot");
    spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).resolves();

    await exportSnapshots.exportSnapshotToTargetAwsAccount(ebsConfig, snapshot);

    expect(spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).calledOnce).toBe(true);
    expect(spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).calledOnce).toBe(false);
    expect(spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).calledOnce).toBe(true);
  });

  it("should copy to quarantine region if source region is not quarantine region, but do not share anything if there are no quarantine AWS accounts defined", async () => {
    const snapshot = "snap-001";
    const copiedSnapshot = "snap-101";

    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyIsSnapshotInQuarantineRegion = sinon.stub(isSnapshotInQuarantineRegion, "isSnapshotInQuarantineRegion");
    spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).returns(false);

    const spyCopySnapshotToTargetRegion = sinon.stub(copySnapshotToTargetRegion, "copySnapshotToTargetRegion");
    spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).resolves(copiedSnapshot);

    const spyShareSnapshot = sinon.stub(shareSnapshot, "shareSnapshot");
    spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).resolves();

    await exportSnapshots.exportSnapshotToTargetAwsAccount(ebsConfig, snapshot);

    expect(spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).calledOnce).toBe(true);
    expect(spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).calledOnce).toBe(true);
    expect(spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).calledOnce).toBe(false);
  });

  it("should not copy to quarantine region if source region and quarantine region are the same, but do not share anything if there are no quarantine AWS accounts defined", async () => {
    const snapshot = "snap-001";
    const copiedSnapshot = "snap-101";

    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-1",
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyIsSnapshotInQuarantineRegion = sinon.stub(isSnapshotInQuarantineRegion, "isSnapshotInQuarantineRegion");
    spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).returns(true);

    const spyCopySnapshotToTargetRegion = sinon.stub(copySnapshotToTargetRegion, "copySnapshotToTargetRegion");
    spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).resolves(copiedSnapshot);

    const spyShareSnapshot = sinon.stub(shareSnapshot, "shareSnapshot");
    spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).resolves();

    await exportSnapshots.exportSnapshotToTargetAwsAccount(ebsConfig, snapshot);

    expect(spyIsSnapshotInQuarantineRegion.withArgs(ebsConfig).calledOnce).toBe(true);
    expect(spyCopySnapshotToTargetRegion.withArgs(ebsConfig, snapshot).calledOnce).toBe(false);
    expect(spyShareSnapshot.withArgs(ebsConfig, copiedSnapshot).calledOnce).toBe(false);
  });
});

describe("exportSnapshotsToTargetAwsAccount()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should call exportSnapshotToTargetAwsAccount on all snapshots", async () => {
    const snap1 = "snap-001";
    const snap2 = "snap-002";
    const snap3 = "snap-003";
    const snapshots = [snap1, snap2, snap3];
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyExportSnapshotToTargetAwsAccount = sinon.stub(exportSnapshots, "exportSnapshotToTargetAwsAccount");
    await exportSnapshots.exportSnapshotsToTargetAwsAccount(ebsConfig, snapshots);

    expect(spyExportSnapshotToTargetAwsAccount.withArgs(ebsConfig, snap1).calledOnce).toBe(true);
    expect(spyExportSnapshotToTargetAwsAccount.withArgs(ebsConfig, snap2).calledOnce).toBe(true);
    expect(spyExportSnapshotToTargetAwsAccount.withArgs(ebsConfig, snap3).calledOnce).toBe(true);
  });
});

describe("exportSnapshotsFromVolumes()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should call createSnapshot, waitForSnapshotCompletion, exportSnapshotsToTargetAwsAccount on all snapshots, describeSnapshotIds when transferAllSnapshots = true", async () => {
    const volume1 = "vol-001";
    const volume2 = "vol-002";
    const volume3 = "vol-003";

    const createdSnapshot1 = "snap-001";
    const createdSnapshot2 = "snap-002";
    const createdSnapshot3 = "snap-003";

    const volumeSnapshots1 = [createdSnapshot1];
    const volumeSnapshots2 = [createdSnapshot2, "snap-004"];
    const volumeSnapshots3 = [createdSnapshot3, "snap-005"];

    const volumes = [volume1, volume2, volume3];
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyCreateSnapshots = sinon.stub(createSnapshot, "createSnapshot");
    spyCreateSnapshots.withArgs(volume1).resolves(createdSnapshot1);
    spyCreateSnapshots.withArgs(volume2).resolves(createdSnapshot2);
    spyCreateSnapshots.withArgs(volume3).resolves(createdSnapshot3);

    const spyWaitForSnapshotCompletion = sinon.stub(waitForSnapshotCompletion, "waitForSnapshotCompletion");
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot1).resolves();
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot2).resolves();
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot3).resolves();

    const spyDescribeSnapshotIds = sinon.stub(describeSnapshotIds, "describeSnapshotIds");
    spyDescribeSnapshotIds.withArgs(volume1).resolves(volumeSnapshots1);
    spyDescribeSnapshotIds.withArgs(volume2).resolves(volumeSnapshots2);
    spyDescribeSnapshotIds.withArgs(volume3).resolves(volumeSnapshots3);

    const spyExportSnapshotsToTargetAwsAccount = sinon.stub(exportSnapshots, "exportSnapshotsToTargetAwsAccount");
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots1).resolves();
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots2).resolves();
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots3).resolves();

    await exportSnapshots.exportSnapshotsFromVolumes(ebsConfig, volumes);

    expect(spyCreateSnapshots.withArgs(volume1).calledOnce).toBe(true);
    expect(spyCreateSnapshots.withArgs(volume2).calledOnce).toBe(true);
    expect(spyCreateSnapshots.withArgs(volume3).calledOnce).toBe(true);

    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot1).calledOnce).toBe(true);
    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot2).calledOnce).toBe(true);
    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot3).calledOnce).toBe(true);

    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots1).calledOnce).toBe(true);
    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots2).calledOnce).toBe(true);
    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, volumeSnapshots3).calledOnce).toBe(true);
  });

  it("should call waitForSnapshotCompletion, exportSnapshotsToTargetAwsAccount on latest snapshot when transferAllSnapshots = false", async () => {
    const volume1 = "vol-001";
    const volume2 = "vol-002";
    const volume3 = "vol-003";

    const createdSnapshot1 = "snap-001";
    const createdSnapshot2 = "snap-002";
    const createdSnapshot3 = "snap-003";

    const volumes = [volume1, volume2, volume3];
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-1",
    };

    const spyCreateSnapshots = sinon.stub(createSnapshot, "createSnapshot");
    spyCreateSnapshots.withArgs(volume1).resolves(createdSnapshot1);
    spyCreateSnapshots.withArgs(volume2).resolves(createdSnapshot2);
    spyCreateSnapshots.withArgs(volume3).resolves(createdSnapshot3);

    const spyWaitForSnapshotCompletion = sinon.stub(waitForSnapshotCompletion, "waitForSnapshotCompletion");
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot1).resolves();
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot2).resolves();
    spyWaitForSnapshotCompletion.withArgs(createdSnapshot3).resolves();

    const spyDescribeSnapshotIds = sinon.stub(describeSnapshotIds, "describeSnapshotIds");
    spyDescribeSnapshotIds.withArgs(volume1).resolves([createdSnapshot1]);
    spyDescribeSnapshotIds.withArgs(volume2).resolves([createdSnapshot2]);
    spyDescribeSnapshotIds.withArgs(volume3).resolves([createdSnapshot3]);

    const spyExportSnapshotsToTargetAwsAccount = sinon.stub(exportSnapshots, "exportSnapshotsToTargetAwsAccount");
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot1]).resolves();
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot2]).resolves();
    spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot3]).resolves();

    await exportSnapshots.exportSnapshotsFromVolumes(ebsConfig, volumes);

    expect(spyCreateSnapshots.withArgs(volume1).calledOnce).toBe(true);
    expect(spyCreateSnapshots.withArgs(volume2).calledOnce).toBe(true);
    expect(spyCreateSnapshots.withArgs(volume3).calledOnce).toBe(true);

    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot1).calledOnce).toBe(true);
    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot2).calledOnce).toBe(true);
    expect(spyWaitForSnapshotCompletion.withArgs(createdSnapshot3).calledOnce).toBe(true);

    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot1]).calledOnce).toBe(true);
    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot2]).calledOnce).toBe(true);
    expect(spyExportSnapshotsToTargetAwsAccount.withArgs(ebsConfig, [createdSnapshot3]).calledOnce).toBe(true);
  });
});

describe("exportSnapshotsFromInstance()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should call describeVolumes and exportSnapshotsFromVolumes()", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-1",
    };
    const instanceId = "001";
    const volumes = ["vol-001"];

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.withArgs(instanceId).resolves(volumes);

    const spyExportSnapshotsFromVolumes = sinon.stub(exportSnapshots, "exportSnapshotsFromVolumes");
    spyExportSnapshotsFromVolumes.withArgs(ebsConfig, volumes).resolves();

    await exportSnapshots.exportSnapshotsFromInstance(ebsConfig, instanceId);

    expect(spyDescribeVolumes.withArgs(instanceId).calledOnce).toBe(true);
    expect(spyExportSnapshotsFromVolumes.withArgs(ebsConfig, volumes).calledOnce).toBe(true);
  });
});
