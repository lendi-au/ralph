import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import { describeVolumes } from "./describeVolumes";

AWSMock.setSDKInstance(AWS);

describe("describeVolumes", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });
  it("should handle if returned value does not have .Volumes attribute", async () => {
    const instanceId = "i-000";
    const expectedResult: string[] = [];
    const returnValue = {};
    const params = {
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [instanceId],
        },
      ],
    };

    const spyDescribeVolumes = sinon.stub();
    spyDescribeVolumes.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeVolumes", spyDescribeVolumes);

    expect(await describeVolumes(instanceId)).toEqual(expectedResult);
  });

  it("should return properly if response is in proper format but empty", async () => {
    const instanceId = "i-000";
    const expectedResult: string[] = [];
    const returnValue = {
      Volumes: [],
    };
    const params = {
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [instanceId],
        },
      ],
    };

    const spyDescribeVolumes = sinon.stub();
    spyDescribeVolumes.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeVolumes", spyDescribeVolumes);

    expect(await describeVolumes(instanceId)).toEqual(expectedResult);
  });

  it("should return properly if one element in the response is malformed", async () => {
    const instanceId = "i-000";
    const expectedResult: string[] = ["100"];
    const returnValue = {
      Volumes: [
        {
          VolumeId: "100",
        },
        {
          OhVolume: "101",
        },
      ],
    };
    const params = {
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [instanceId],
        },
      ],
    };

    const spyDescribeVolumes = sinon.stub();
    spyDescribeVolumes.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeVolumes", spyDescribeVolumes);
    expect(await describeVolumes(instanceId)).toEqual(expectedResult);
  });
  it("should return properly if all elements in the response is in proper format", async () => {
    const instanceId = "i-000";
    const expectedResult: string[] = ["100", "101"];
    const returnValue = {
      Volumes: [
        {
          VolumeId: "100",
        },
        {
          VolumeId: "101",
        },
      ],
    };
    const params = {
      Filters: [
        {
          Name: "attachment.instance-id",
          Values: [instanceId],
        },
      ],
    };

    const spyDescribeVolumes = sinon.stub();
    spyDescribeVolumes.withArgs(params).resolves(returnValue);
    AWSMock.mock("EC2", "describeVolumes", spyDescribeVolumes);
    expect(await describeVolumes(instanceId)).toEqual(expectedResult);
  });
});
