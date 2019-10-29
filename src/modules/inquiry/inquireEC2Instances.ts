import { EC2 } from "aws-sdk";
import * as inquirer from "inquirer";
import { ReservationList } from "aws-sdk/clients/ec2";

export interface PromptAnswers {
  instanceId: string;
}

export const identifyInstance = async () => {
  const instances = await getInstances();
  const selectedInstance = await inquirer.prompt<PromptAnswers>([
    {
      name: "instanceId",
      message: "Which instance do you want to lock down?",
      choices: instances,
      type: "list"
    }
  ]);

  return selectedInstance.instanceId;
};

export const getInstances = async () => {
  const ec2 = new EC2();
  const response = await ec2.describeInstances().promise();
  return extractInstanceIds(response.Reservations || []);
};

export const extractInstanceIds = (response: ReservationList) => {
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
        value: instance.InstanceId
      };
    });
};

export const getInstanceName = (instance: EC2.Instance) => {
  let instanceName: string | undefined = "";
  instanceName = instance.InstanceId;
  if (instance.KeyName !== undefined) {
    instanceName += ` (${instance.KeyName})`;
  }
  return instanceName;
};
