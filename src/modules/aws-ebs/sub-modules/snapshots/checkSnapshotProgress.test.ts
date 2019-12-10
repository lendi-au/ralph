import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import { checkSnapshotProgress } from "./checkSnapshotProgress";

AWSMock.setSDKInstance(AWS);

describe("checkSnapshotProgress()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should return SnapshotProgress correctly if describeSnapshots returned with valid snapshot attribute", async () => {
    const returnValue = {
      Snapshots: [
        {
          State: "pending",
          Progress: "0%",
          VolumeSize: "8",
        },
      ],
    };
    const snapshotId = "snap-00000000";
    const params = {
      SnapshotIds: [snapshotId],
    };
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(await checkSnapshotProgress(snapshotId)).toEqual({
      state: "pending",
      progress: "0%",
      volumeSize: "8",
    });
  });

  it("should throw error if snapshotAttribute.Snapshots is missing", () => {
    const returnValue = {};
    const snapshotId = "snap-00000000";
    const params = {
      SnapshotIds: [snapshotId],
    };

    const expectedErrorMessage = "Snapshot snap-00000000 is missing or has missing required attributes.";
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(checkSnapshotProgress(snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });

  it("should throw error if snapshotAttribute.Snapshots[0] is missing", () => {
    const returnValue = {
      Snapshots: [],
    };
    const snapshotId = "snap-00000000";
    const params = {
      SnapshotIds: [snapshotId],
    };
    const expectedErrorMessage = "Snapshot snap-00000000 is missing or has missing required attributes.";
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(checkSnapshotProgress(snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });

  it("should throw error if snapshotAttribute.Snapshots[0].State is missing", () => {
    const returnValue = {
      Snapshots: [
        {
          Progress: "0%",
          VolumeSize: "8",
        },
      ],
    };
    const snapshotId = "snap-00000000";
    const params = {
      SnapshotIds: [snapshotId],
    };
    const expectedErrorMessage = "Snapshot snap-00000000 is missing or has missing required attributes.";
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(checkSnapshotProgress(snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });

  it("should throw error if snapshotAttribute.Snapshots[0].Progress is missing", () => {
    const returnValue = {
      Snapshots: [
        {
          State: "pending",
          VolumeSize: "8",
        },
      ],
    };
    const snapshotId = "snap-00000000";
    const params = {
      SnapshotIds: [snapshotId],
    };
    const expectedErrorMessage = "Snapshot snap-00000000 is missing or has missing required attributes.";
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(checkSnapshotProgress(snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });

  it("should throw error if snapshotAttribute.Snapshots[0].VolumeSize is missing", () => {
    const returnValue = {
      Snapshots: [
        {
          State: "pending",
          Progress: "0%",
        },
      ],
    };
    const snapshotId = "snap-00000000";

    const expectedErrorMessage = "Snapshot snap-00000000 is missing or has missing required attributes.";
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(checkSnapshotProgress(snapshotId)).rejects.toEqual(new Error(expectedErrorMessage));
  });
});
