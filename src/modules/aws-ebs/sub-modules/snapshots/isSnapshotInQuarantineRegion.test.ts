import { isSnapshotInQuarantineRegion } from "./isSnapshotInQuarantineRegion";
import { AwsRegion } from "../../../region/AwsRegion";

describe("isSnapshotInQuarantineRegion()", () => {
  it("should return true if sourceAwsRegion in config is equal to quarantineAwsRegion", () => {
    const ebsConfig = {
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
    };

    expect(isSnapshotInQuarantineRegion(ebsConfig)).toBe(true);
  });
  it("should return false if sourceAwsRegion in config is not equal to quarantineAwsRegion", () => {
    const ebsConfig = {
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: true,
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_1,
    };
    expect(isSnapshotInQuarantineRegion(ebsConfig)).toBe(false);
  });
});
