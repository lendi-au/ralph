import { loadEbsConfig } from "./loadEbsConfig";
import { AwsRegion } from "../../../region/AwsRegion";

describe("loadEbsConfig()", () => {
  beforeEach(() => {
    delete process.env.AWS_REGION;
    delete process.env.QUARANTINE_AWS_REGION;
    delete process.env.QUARANTINE_AWS_ACCOUNTS;
    delete process.env.TRANSFER_ALL_SNAPSHOTS;
  });

  afterAll(() => {
    delete process.env.AWS_REGION;
    delete process.env.QUARANTINE_AWS_REGION;
    delete process.env.QUARANTINE_AWS_ACCOUNTS;
    delete process.env.TRANSFER_ALL_SNAPSHOTS;
  });

  it("should throw an error if AWS_REGION is not defined", () => {
    process.env.AWS_REGION = undefined;
    process.env.QUARANTINE_AWS_REGION = undefined;
    process.env.QUARANTINE_AWS_ACCOUNTS = undefined;
    process.env.TRANSFER_ALL_SNAPSHOTS = undefined;

    expect(() => {
      loadEbsConfig();
    }).toThrow("Env variable AWS_REGION must be defined.");
  });

  it("should default QUARANTINE_AWS_REGION to AWS_REGION if QUARANTINE_AWS_REGION is not defined", () => {
    process.env.AWS_REGION = AwsRegion.AP_SOUTHEAST_2;
    process.env.QUARANTINE_AWS_REGION = undefined;
    process.env.QUARANTINE_AWS_ACCOUNTS = "";
    process.env.TRANSFER_ALL_SNAPSHOTS = "true";

    expect(loadEbsConfig()).toEqual({
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    });
  });

  it("should default QUARANTINE_AWS_ACCOUNTS to empty array if it is undefined", () => {
    process.env.AWS_REGION = AwsRegion.AP_SOUTHEAST_2;
    process.env.QUARANTINE_AWS_REGION = undefined;
    process.env.QUARANTINE_AWS_ACCOUNTS = "";
    process.env.TRANSFER_ALL_SNAPSHOTS = "true";

    expect(loadEbsConfig()).toEqual({
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    });
  });

  it("should default TRANSFER_ALL_SNAPSHOTS to false if it is undefined", () => {
    process.env.AWS_REGION = AwsRegion.AP_SOUTHEAST_2;
    process.env.QUARANTINE_AWS_REGION = AwsRegion.AP_SOUTHEAST_1;
    process.env.QUARANTINE_AWS_ACCOUNTS = "00000000";
    process.env.TRANSFER_ALL_SNAPSHOTS = undefined;

    expect(loadEbsConfig()).toEqual({
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_1,
      quarantineAwsAccounts: ["00000000"],
      transferAllSnapshots: false,
    });
  });

  it("should set default values for env variables when all of them are undefined except for AWS_REGION ", () => {
    process.env.AWS_REGION = AwsRegion.AP_SOUTHEAST_2;
    process.env.QUARANTINE_AWS_REGION = undefined;
    process.env.QUARANTINE_AWS_ACCOUNTS = undefined;
    process.env.TRANSFER_ALL_SNAPSHOTS = undefined;

    expect(loadEbsConfig()).toEqual({
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: [],
      transferAllSnapshots: false,
    });
  });

  it("should build the config out of the env variables if set correctly", () => {
    process.env.AWS_REGION = AwsRegion.AP_SOUTHEAST_2;
    process.env.QUARANTINE_AWS_REGION = AwsRegion.AP_SOUTHEAST_1;
    process.env.QUARANTINE_AWS_ACCOUNTS = "00000000, 00000001,000003,  00000005 ";
    process.env.TRANSFER_ALL_SNAPSHOTS = "true";

    expect(loadEbsConfig()).toEqual({
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_1,
      quarantineAwsAccounts: ["00000000", "00000001", "000003", "00000005"],
      transferAllSnapshots: true,
    });
  });
});
