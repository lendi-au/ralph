import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import { EbsConfig } from "../config/EbsConfig";
import { shareSnapshot } from "./shareSnapshot";
import { EC2 } from "aws-sdk";
import { extractAwsRegion } from "../../../region/extractAwsRegion";

AWSMock.setSDKInstance(AWS);

describe("shareSnapshot()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should pass the right parameters to modifySnapshotAttribute on the right EC2 region", async () => {
    const snapshotId = "snap-000";
    const ebsConfig: EbsConfig = {
      sourceAwsRegion: extractAwsRegion("ap-southeast-1"),
      quarantineAwsAccounts: ["000", "001"],
      quarantineAwsRegion: extractAwsRegion("ap-southeast-2"),
      transferAllSnapshots: false,
    };

    const params: EC2.ModifySnapshotAttributeRequest = {
      SnapshotId: "snap-000",
      Attribute: "createVolumePermission",
      OperationType: "add",
      UserIds: ["000", "001"],
    };

    const spyModifySnapshotAttribute = sinon.stub();
    spyModifySnapshotAttribute.withArgs(params).resolves();
    AWSMock.mock("EC2", "modifySnapshotAttribute", spyModifySnapshotAttribute);

    await shareSnapshot(ebsConfig, snapshotId);
    expect(spyModifySnapshotAttribute.withArgs(params).calledOnce).toBe(true);
  });
});
