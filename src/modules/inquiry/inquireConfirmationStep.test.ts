import { inquireConfirmationStep } from "./inquireConfirmationStep";
import * as sinon from "sinon";
import * as inquirer from "inquirer";

describe("inquireConfirmationStep()", () => {
  for (const input of ["true", "false"]) {
    test("Inquirer should return right confirmation given ${input}", async () => {
      const spyInquirerPrompt = sinon.stub(inquirer, "prompt").resolves({
        confirm: input
      });

      const confirm = await inquireConfirmationStep();
      expect(spyInquirerPrompt.calledOnce).toBe(true);
      expect(confirm).toBe(input);
      spyInquirerPrompt.restore();
    });
  }
});
