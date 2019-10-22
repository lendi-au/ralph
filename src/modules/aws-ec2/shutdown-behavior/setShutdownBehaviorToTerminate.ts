import { changeShutdownBehavior } from "./changeShutdownBehavior";

export const setShutdownBehaviorToTerminate = (instanceId: string) => {
  changeShutdownBehavior(instanceId, "terminate");
};
