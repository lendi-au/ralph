import * as sinon from "sinon";
import { describeExportEbsSnapshotsPlan } from "./describeExportEbsSnapshotsPlan";
import * as describeSnapshotIds from "./describeSnapshots";
import * as describeVolumes from "../volumes/describeVolumes";

describe("describeExportEbsSnapshotsPlan()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should inform user that no action will be taken when instance has no attached volumes.", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-1",
    };

    const instanceId = "001";
    const expectedMessage = "001: Instance has no volumes. No action will be taken.";

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.resolves([]);

    expect(await describeExportEbsSnapshotsPlan(ebsConfig, instanceId)).toEqual(expectedMessage);
  });

  it("should tell user if the snapshots will be copied to a target region first", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-1",
    };

    const instanceId = "001";
    const expectedMessage =
      "Latest snapshots from the EBS volumes attached to instance 001 will be \
exported to quarantine accounts.\nThese snapshots will first be copied to \
this region first: ap-southeast-2\nVolumes: vol-001\nvol-001:\n  - Ralph \
will create a latest snapshot out of this volume.\nAll copied snapshots will \
then be exported to quarantine AWS Accounts: 00000000.";

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.resolves(["vol-001"]);

    const spyDescribeSnapshotsIds = sinon.stub(describeSnapshotIds, "describeSnapshotIds");
    spyDescribeSnapshotsIds.resolves(["snap-001"]);

    expect(await describeExportEbsSnapshotsPlan(ebsConfig, instanceId)).toEqual(expectedMessage);
  });

  it("should handle when transferAllSnapshots is set to false", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-1",
    };

    const instanceId = "001";
    const expectedMessage =
      "Latest snapshots from the EBS volumes attached to instance 001 will be \
exported to quarantine accounts.\nThese snapshots will first be copied to \
this region first: ap-southeast-2\nVolumes: vol-001\nvol-001:\n  - Ralph \
will create a latest snapshot out of this volume.\nAll copied snapshots will \
then be exported to quarantine AWS Accounts: 00000000.";

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.resolves(["vol-001"]);

    expect(await describeExportEbsSnapshotsPlan(ebsConfig, instanceId)).toEqual(expectedMessage);
  });

  it("should handle when volumes have snapshots and if transferAllSnapshots is set to true", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const instanceId = "001";
    const expectedMessage =
      "All snapshots from the EBS volumes attached to instance 001 will be \
exported to quarantine accounts.\nThese snapshots will first be copied to \
this region first: ap-southeast-2\nVolumes: vol-001\nvol-001:\n  - Ralph \
will create a latest snapshot out of this volume.\n  - snap-001\n  - snap-002\n\
All copied snapshots will then be exported to quarantine AWS Accounts: 00000000.";

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.resolves(["vol-001"]);

    const spyDescribeSnapshotsIds = sinon.stub(describeSnapshotIds, "describeSnapshotIds");
    spyDescribeSnapshotsIds.resolves(["snap-001", "snap-002"]);

    expect(await describeExportEbsSnapshotsPlan(ebsConfig, instanceId)).toEqual(expectedMessage);
  });

  it("should handle when volumes have no snapshots and if transferAllSnapshots is set to true", async () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };

    const instanceId = "001";
    const expectedMessage =
      "All snapshots from the EBS volumes attached to instance 001 will be \
exported to quarantine accounts.\nThese snapshots will first be copied to \
this region first: ap-southeast-2\nVolumes: vol-001\nvol-001:\n  - Ralph \
will create a latest snapshot out of this volume.\n\
All copied snapshots will then be exported to quarantine AWS Accounts: 00000000.";

    const spyDescribeVolumes = sinon.stub(describeVolumes, "describeVolumes");
    spyDescribeVolumes.resolves(["vol-001"]);

    const spyDescribeSnapshotsIds = sinon.stub(describeSnapshotIds, "describeSnapshotIds");
    spyDescribeSnapshotsIds.resolves([]);

    expect(await describeExportEbsSnapshotsPlan(ebsConfig, instanceId)).toEqual(expectedMessage);
  });
});
