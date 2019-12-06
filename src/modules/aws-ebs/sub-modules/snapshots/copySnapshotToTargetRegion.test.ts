import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import * as buildCopySnapshotDescription from "./buildCopySnapshotDescription";
import { copySnapshotToTargetRegion } from "./copySnapshotToTargetRegion";

AWSMock.setSDKInstance(AWS);

describe("copySnapshotToTargetRegion()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should return SnapshotId when copySnapshot call is successful", async () => {
    const config = {
      sourceAwsRegion: "ap-southeast-2",
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    };

    const snapshotId = "snap-001";
    const returnValue = snapshotId;

    const spyBuildCopySnapshotDescription = sinon.stub(buildCopySnapshotDescription, "buildCopySnapshotDescription");
    spyBuildCopySnapshotDescription.returns("Copy Snapshot Description Mock");

    const spyCopySnapshot = sinon.stub();
    spyCopySnapshot.resolves({
      SnapshotId: returnValue,
    });
    AWSMock.mock("EC2", "copySnapshot", spyCopySnapshot);

    expect(await copySnapshotToTargetRegion(config, snapshotId)).toEqual(returnValue);
  });

  it("should throw an error if copySnapshot did not return a SnapshotId", async () => {
    const config = {
      sourceAwsRegion: "ap-southeast-2",
      quarantineAwsRegion: "ap-southeast-2",
      quarantineAwsAccounts: [],
      transferAllSnapshots: true,
    };

    const expectedErrorMessage = "Copied snapshot did not return a SnapshotId";
    const snapshotId = "snap-001";

    const spyBuildCopySnapshotDescription = sinon.stub(buildCopySnapshotDescription, "buildCopySnapshotDescription");
    spyBuildCopySnapshotDescription.returns("Copy Snapshot Description Mock");

    const spyCopySnapshot = sinon.stub();
    spyCopySnapshot.resolves({});
    AWSMock.mock("EC2", "copySnapshot", spyCopySnapshot);

    expect(copySnapshotToTargetRegion(config, snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });
});
