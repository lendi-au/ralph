import { changeTerminationProtection } from './changeTerminationProtection';
export const enableTerminationProtection = (instanceId: string) => {
  changeTerminationProtection(instanceId, 'true');
};
