import { RemoveIamInstanceProfile } from "./RemoveIamInstanceProfile";
import * as diassociateIamInstanceProfile from "./sub-modules/diassociateIamInstanceProfile";
import * as describeIamInstanceProfileAssociations from "./sub-modules/describeIamInstanceProfileAssociations";
import * as sinon from "sinon";

describe("RemoveIamInstanceProfile.describeAction()", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("should proceed with normal flow given input", async () => {
    const instanceId = "i-1234567890abcdef0";
    const runbookStep = new RemoveIamInstanceProfile();
    const currentValue = [
      {
        IamInstanceProfile: {
          Arn: "sample-arn-1"
        }
      },
      {
        IamInstanceProfile: {
          Arn: "sample-arn-2"
        }
      }
    ];

    const expectedOutput =
      "RemoveIamInstanceProfile: This will disassociate the following Iam Instance Profiles: ['sample-arn-1, sample-arn-2'] for i-1234567890abcdef0";
    const spyDescribeIamInstanceProfileAssociations = sinon.stub(
      describeIamInstanceProfileAssociations,
      "describeIamInstanceProfileAssociations"
    );

    spyDescribeIamInstanceProfileAssociations
      .withArgs(instanceId)
      .resolves(currentValue);

    const actualOutput = await runbookStep.describeAction(instanceId);
    expect(spyDescribeIamInstanceProfileAssociations.calledOnce).toBe(true);
    expect(actualOutput).toBe(expectedOutput);
  });

  it("should proceed with normal flow given malformed input", async () => {
    const instanceId = "i-1234567890abcdef0";
    const runbookStep = new RemoveIamInstanceProfile();
    const expectedOutput =
      "RemoveIamInstanceProfile: No changes since there are no Iam Instance Profile Associations to disassociate.";

    const spyDescribeIamInstanceProfileAssociations = sinon.stub(
      describeIamInstanceProfileAssociations,
      "describeIamInstanceProfileAssociations"
    );

    spyDescribeIamInstanceProfileAssociations.withArgs(instanceId).resolves([]);

    const actualOutput = await runbookStep.describeAction(instanceId);

    expect(spyDescribeIamInstanceProfileAssociations.calledOnce).toBe(true);
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe("RemoveIamInstanceProfile.run()", () => {
  it("should call diassociateIamInstanceProfile(instanceId)", async () => {
    const instanceId = "i-1234567890abcdef0";
    const runbookStep = new RemoveIamInstanceProfile();

    const spyDiassociateIamInstanceProfile = sinon.stub(
      diassociateIamInstanceProfile,
      "diassociateIamInstanceProfile"
    );
    spyDiassociateIamInstanceProfile.resolves();

    await runbookStep.run(instanceId);

    expect(spyDiassociateIamInstanceProfile.calledOnce).toBe(true);
  });
});
