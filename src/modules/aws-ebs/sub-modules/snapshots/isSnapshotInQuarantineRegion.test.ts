import { isSnapshotInQuarantineRegion } from "./isSnapshotInQuarantineRegion";

describe("isSnapshotInQuarantineRegion()", () => {
  it("should return true if sourceAwsRegion in config is equal to quarantineAwsRegion", () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-2",
    };

    expect(isSnapshotInQuarantineRegion(ebsConfig)).toBe(true);
  });
  it("should return false if sourceAwsRegion in config is not equal to quarantineAwsRegion", () => {
    const ebsConfig = {
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: "ap-southeast-1",
    };
    expect(isSnapshotInQuarantineRegion(ebsConfig)).toBe(false);
  });
});
