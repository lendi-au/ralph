import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import { describeSnapshotIds } from "./describeSnapshots";

AWSMock.setSDKInstance(AWS);

describe("describeSnapshotIds()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should handle if returned value does not have .Snapshots attribute", async () => {
    const volumeId = "vol-000";
    const expectedResult: string[] = [];
    const returnValue = {};
    const params = {
      Filters: [
        {
          Name: "volume-id",
          Values: [volumeId],
        },
      ],
    };
    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(await describeSnapshotIds(volumeId)).toEqual(expectedResult);
  });

  it("should return if response is in proper format but empty", async () => {
    const volumeId = "vol-000";
    const expectedResult: string[] = [];
    const returnValue = {
      Snapshots: [],
    };
    const params = {
      Filters: [
        {
          Name: "volume-id",
          Values: [volumeId],
        },
      ],
    };

    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(await describeSnapshotIds(volumeId)).toEqual(expectedResult);
  });

  it("should return properly if one element in the response is malformed", async () => {
    const volumeId = "vol-000";
    const expectedResult: string[] = ["100"];
    const returnValue = {
      Snapshots: [
        {
          SnapshotId: "100",
        },
        {
          OhSnap: "101",
        },
      ],
    };
    const params = {
      Filters: [
        {
          Name: "volume-id",
          Values: [volumeId],
        },
      ],
    };

    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(await describeSnapshotIds(volumeId)).toEqual(expectedResult);
  });
  it("should return properly if all elements in the response is in proper format", async () => {
    const volumeId = "vol-000";
    const expectedResult: string[] = ["100", "101"];
    const returnValue = {
      Snapshots: [
        {
          SnapshotId: "100",
        },
        {
          SnapshotId: "101",
        },
      ],
    };
    const params = {
      Filters: [
        {
          Name: "volume-id",
          Values: [volumeId],
        },
      ],
    };

    const spyDescribeSnapshots = sinon.stub();
    spyDescribeSnapshots.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeSnapshots", spyDescribeSnapshots);

    expect(await describeSnapshotIds(volumeId)).toEqual(expectedResult);
  });
});
