import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import { createSnapshot } from "./createSnapshot";

AWSMock.setSDKInstance(AWS);

describe("createSnapshot()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should return SnapshotId when createSnapshot call is successful", async () => {
    const volumeId = "vol-000";
    const returnValue = "snap-000";
    const params = {
      VolumeId: volumeId,
      Description: `[Ralph] Latest snapshot for ${volumeId}`,
    };

    const spyCreateSnapshot = sinon.stub();
    spyCreateSnapshot.withArgs(params).resolves({
      SnapshotId: returnValue,
    });
    AWSMock.mock("EC2", "createSnapshot", spyCreateSnapshot);

    expect(await createSnapshot(volumeId)).toEqual(returnValue);
  });

  it("should throw an error if createSnapshot did not return a SnapshotId", async () => {
    const volumeId = "vol-000";
    const expectedErrorMessage = "No SnapshotId returned when creating snapshot.";
    const params = {
      VolumeId: volumeId,
      Description: `[Ralph] Latest snapshot for ${volumeId}`,
    };

    const spyCreateSnapshot = sinon.stub();
    spyCreateSnapshot.withArgs(params).resolves({});
    AWSMock.mock("EC2", "createSnapshot", spyCreateSnapshot);

    expect(createSnapshot(volumeId)).rejects.toEqual(new Error(expectedErrorMessage));
  });
});
