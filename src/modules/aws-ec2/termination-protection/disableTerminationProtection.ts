import { changeTerminationProtection } from './changeTerminationProtection';
export const disableTerminationProtection = (instanceId: string) => {
  changeTerminationProtection(instanceId, 'false');
};
