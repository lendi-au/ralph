import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as sinon from "sinon";
import * as inquirer from "inquirer";
import * as inquireEC2Instances from "./inquireEC2Instances";

AWSMock.setSDKInstance(AWS);

describe("identifyInstance()", () => {
  test("should return instanceId", async () => {
    const expectedInstanceId = "i-1234567890abcdef0";
    const spyGetInstances = sinon
      .stub(inquireEC2Instances, "getInstances")
      .resolves([]);
    const spyInquirerPrompt = sinon.stub(inquirer, "prompt").resolves({
      instanceId: expectedInstanceId
    });

    const instanceId = await inquireEC2Instances.identifyInstance();
    expect(spyGetInstances.calledOnce).toBe(true);
    expect(spyInquirerPrompt.calledOnce).toBe(true);
    expect(instanceId).toEqual(expectedInstanceId);

    sinon.restore();
  });
});

describe("getInstances()", () => {
  it("should return a list of instances if they exist", async () => {
    const expectedDescribeInstancesOutput = {
      Reservations: [
        {
          Groups: [],
          Instances: [
            {
              ImageId: "ami-00000000000000000",
              InstanceId: "i-1234567890abcdef0",
              InstanceType: "t3.2xlarge"
            }
          ],
          OwnerId: "000000000000",
          RequesterId: "000000000000",
          ReservationId: "r-00000000000000000"
        }
      ]
    };

    const expectedInstances = [
      {
        name: "sample-instance",
        value: "i-1234567890abcdef0"
      }
    ];

    const spyDescribeInstances = sinon
      .stub()
      .resolves(expectedDescribeInstancesOutput);
    AWSMock.mock("EC2", "describeInstances", spyDescribeInstances);

    const spyExtractInstanceIds = sinon.stub(
      inquireEC2Instances,
      "extractInstanceIds"
    );
    spyExtractInstanceIds
      .withArgs(expectedDescribeInstancesOutput.Reservations)
      .returns(expectedInstances);

    const responseReservations = await inquireEC2Instances.getInstances();
    expect(responseReservations).toEqual(expectedInstances);

    sinon.restore();
    AWSMock.restore("EC2");
  });
});

describe("extractInstanceIds()", () => {
  it("should extract instance Ids as expected", () => {
    const reservationListInput = [
      {
        Groups: [],
        Instances: [
          {
            ImageId: "ami-00000000000000000",
            InstanceId: "i-1234567890abcdef0",
            InstanceType: "t3.2xlarge",
            KeyName: "sample-instance"
          }
        ],
        OwnerId: "000000000000",
        RequesterId: "000000000000",
        ReservationId: "r-00000000000000000"
      }
    ];

    const flattenReservationListInput = {
      ImageId: "ami-00000000000000000",
      InstanceId: "i-1234567890abcdef0",
      InstanceType: "t3.2xlarge",
      KeyName: "sample-instance"
    };

    const expectedOutput = [
      {
        name: "i-1234567890abcdef0 (sample-instance)",
        value: "i-1234567890abcdef0"
      }
    ];

    const spyGetInstanceName = sinon.stub(
      inquireEC2Instances,
      "getInstanceName"
    );
    spyGetInstanceName
      .withArgs(flattenReservationListInput)
      .returns("i-1234567890abcdef0 (sample-instance)");

    const output = inquireEC2Instances.extractInstanceIds(reservationListInput);
    expect(output).toEqual(expectedOutput);
    sinon.restore();
  });
});

describe("getInstanceName()", () => {
  it("should return the correct instance name format", () => {
    const expectedOutput = "i-1234567890abcdef0 (sample-instance)";
    const instanceInput = {
      InstanceId: "i-1234567890abcdef0",
      KeyName: "sample-instance"
    };
    const output = inquireEC2Instances.getInstanceName(instanceInput);
    expect(output).toStrictEqual(expectedOutput);
  });
});
