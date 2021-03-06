import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import * as buildCopySnapshotDescription from "./buildCopySnapshotDescription";
import { copySnapshotToTargetRegion } from "./copySnapshotToTargetRegion";
import { AwsRegion } from "../../../region/AwsRegion";

AWSMock.setSDKInstance(AWS);

describe("copySnapshotToTargetRegion()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should return SnapshotId when copySnapshot call is successful", async () => {
    const config = {
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    };

    const snapshotId = "snap-001";
    const returnValue = snapshotId;
    const description = "Copy Snapshot Description Mock";
    const params = {
      Description: description,
      SourceRegion: config.sourceAwsRegion,
      SourceSnapshotId: snapshotId,
    };

    const spyBuildCopySnapshotDescription = sinon.stub(buildCopySnapshotDescription, "buildCopySnapshotDescription");
    spyBuildCopySnapshotDescription.withArgs(config, snapshotId).returns(description);

    const spyCopySnapshot = sinon.stub();
    spyCopySnapshot.withArgs(params).resolves({
      SnapshotId: returnValue,
    });
    AWSMock.mock("EC2", "copySnapshot", spyCopySnapshot);

    expect(await copySnapshotToTargetRegion(config, snapshotId)).toEqual(returnValue);
    expect(spyBuildCopySnapshotDescription.withArgs(config, snapshotId).calledOnce).toBe(true);
    expect(spyCopySnapshot.withArgs(params).calledOnce).toBe(true);
  });

  it("should throw an error if copySnapshot did not return a SnapshotId", async () => {
    const config = {
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    };

    const expectedErrorMessage = "Copied snapshot did not return a SnapshotId";
    const snapshotId = "snap-001";
    const description = "Copy Snapshot Description Mock";
    const params = {
      Description: description,
      SourceRegion: config.sourceAwsRegion,
      SourceSnapshotId: snapshotId,
    };

    const spyBuildCopySnapshotDescription = sinon.stub(buildCopySnapshotDescription, "buildCopySnapshotDescription");
    spyBuildCopySnapshotDescription.withArgs(config, snapshotId).returns("Copy Snapshot Description Mock");

    const spyCopySnapshot = sinon.stub();
    spyCopySnapshot.withArgs(params).resolves({});
    AWSMock.mock("EC2", "copySnapshot", spyCopySnapshot);

    expect(copySnapshotToTargetRegion(config, snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });
});
