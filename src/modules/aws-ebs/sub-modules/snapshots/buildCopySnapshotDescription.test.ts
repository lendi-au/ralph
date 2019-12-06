import { buildCopySnapshotDescription } from "./buildCopySnapshotDescription";

describe("buildCopySnapshotDescription()", () => {
  it("should return correct format", () => {
    const snapshotId = "snap-00000000";
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
      sourceAwsRegion: "ap-southeast-2",
    };

    expect(buildCopySnapshotDescription(ebsConfig, snapshotId)).toEqual(
      "[Ralph] Copied snap-00000000 from ap-southeast-2",
    );
  });
});
