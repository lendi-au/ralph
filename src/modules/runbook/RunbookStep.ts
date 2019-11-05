export abstract class RunbookStep {
  abstract async describeAction(instanceId: string): Promise<string>;
  abstract run(instanceId: string): Promise<void> | void;
}
