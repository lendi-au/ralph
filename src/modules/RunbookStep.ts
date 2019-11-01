export abstract class RunbookStep {
  abstract async describeAction(instanceId: string): Promise<void>;
  abstract run(instanceId: string): Promise<void> | void;
}
