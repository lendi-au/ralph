import { EC2 } from "aws-sdk";
import * as inquirer from "inquirer";
import { ReservationList } from "aws-sdk/clients/ec2";

export interface PromptAnswers {
  instanceId: string;
}

export interface InstanceIdentifier {
  name: string;
  value: string | undefined;
}

export const getInstanceName = (instance: EC2.Instance): string => {
  let instanceName: string = instance.InstanceId || "";
  if (instance.KeyName !== undefined) {
    instanceName += ` (${instance.KeyName})`;
  }
  return instanceName;
};

export const extractInstanceIds = (response: ReservationList): InstanceIdentifier[] => {
  return response
    .map(instanceGroup => {
      if (!instanceGroup.Instances) {
        return [];
      }
      return instanceGroup.Instances;
    })
    .reduce((a, b) => a.concat(b), []) // Flatten array within 1 level
    .map(instance => {
      return {
        name: getInstanceName(instance),
        value: instance.InstanceId,
      };
    });
};

export const getInstances = async (): Promise<InstanceIdentifier[]> => {
  const ec2 = new EC2();
  const response = await ec2.describeInstances().promise();
  return extractInstanceIds(response.Reservations || []);
};

export const identifyInstance = async (): Promise<string> => {
  const instances = await getInstances();
  const selectedInstance = await inquirer.prompt<PromptAnswers>([
    {
      name: "instanceId",
      message: "Which instance do you want to lock down?",
      choices: instances,
      type: "list",
    },
  ]);

  return selectedInstance.instanceId;
};
