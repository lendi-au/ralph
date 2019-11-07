import * as inquirer from "inquirer";

export interface PromptAnswers {
  confirm: boolean;
}

export const inquireConfirmationStep = async () => {
  const selectedInstance = await inquirer.prompt<PromptAnswers>([
    {
      name: "confirm",
      message: "Do you want to proceed with the changes?",
      type: "confirm",
      default: false,
    },
  ]);

  return selectedInstance.confirm;
};
