import * as AWS from "aws-sdk";
import * as AWSMock from "aws-sdk-mock";
import * as describeIamInstanceProfileAssociations from "./describeIamInstanceProfileAssociations";
import { diassociateIamInstanceProfile } from "./diassociateIamInstanceProfile";
import * as sinon from "sinon";

AWSMock.setSDKInstance(AWS);

describe("diassociateIamInstanceProfile()", () => {
  afterEach(() => {
    AWSMock.restore("EC2");
    sinon.restore();
  });

  it("should disassociate valid IAM instance profiles", async () => {
    const instanceId = "i-1234567890abcdef0";
    const responseData = [
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      }
    ];

    const spyDescribeIamInstanceProfileAssociations = sinon.stub(
      describeIamInstanceProfileAssociations,
      "describeIamInstanceProfileAssociations"
    );
    spyDescribeIamInstanceProfileAssociations
      .withArgs(instanceId)
      .resolves(responseData);

    const spyDisassociateIamInstanceProfile = sinon.stub();
    spyDisassociateIamInstanceProfile.resolves();
    AWSMock.mock(
      "EC2",
      "disassociateIamInstanceProfile",
      spyDisassociateIamInstanceProfile
    );

    await diassociateIamInstanceProfile(instanceId);

    expect(spyDisassociateIamInstanceProfile.calledThrice).toBe(true);
  });

  it("should disassociate valid IAM instance profiles while ignore malformed ones", async () => {
    const instanceId = "i-1234567890abcdef0";
    const responseData = [
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        AssociationId: "iip-assoc-00000000000000000",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        AssociationId: "",
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      },
      {
        InstanceId: "i-00000000000000000",
        IamInstanceProfile: {
          Arn: "arn:aws:iam::000000000000:instance-profile/sample",
          Id: "AAAAAAAAAAAAAAAAAAAAA"
        },
        State: "associated"
      }
    ];

    const spyDescribeIamInstanceProfileAssociations = sinon.stub(
      describeIamInstanceProfileAssociations,
      "describeIamInstanceProfileAssociations"
    );
    spyDescribeIamInstanceProfileAssociations
      .withArgs(instanceId)
      .resolves(responseData);

    const spyDisassociateIamInstanceProfile = sinon.stub();
    spyDisassociateIamInstanceProfile.resolves();
    AWSMock.mock(
      "EC2",
      "disassociateIamInstanceProfile",
      spyDisassociateIamInstanceProfile
    );

    await diassociateIamInstanceProfile(instanceId);

    expect(spyDisassociateIamInstanceProfile.calledThrice).toBe(true);
  });

  it("should handle instances with no IAM instance profile", async () => {
    const instanceId = "i-1234567890abcdef0";

    const spyDescribeIamInstanceProfileAssociations = sinon.stub(
      describeIamInstanceProfileAssociations,
      "describeIamInstanceProfileAssociations"
    );
    spyDescribeIamInstanceProfileAssociations.withArgs(instanceId).resolves([]);

    const spyDisassociateIamInstanceProfile = sinon.stub();
    spyDisassociateIamInstanceProfile.resolves();
    AWSMock.mock(
      "EC2",
      "disassociateIamInstanceProfile",
      spyDisassociateIamInstanceProfile
    );

    await diassociateIamInstanceProfile(instanceId);

    expect(spyDisassociateIamInstanceProfile.notCalled).toBe(true);
  });
});
