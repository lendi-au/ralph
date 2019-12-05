import { RunbookStep } from "../runbook/RunbookStep";
import { describeExportEbsSnapshotsPlan } from "./sub-modules/snapshots/describeExportEbsSnapshotsPlan";
import { loadEbsConfig } from "./sub-modules/config/loadEbsConfig";
import { exportSnapshotsFromInstance } from "./sub-modules/snapshots/exportSnapshots";

export class ExportEbsSnapshots extends RunbookStep {
  ebsConfig = loadEbsConfig();

  async describeAction(instanceId: string): Promise<string> {
    return describeExportEbsSnapshotsPlan(this.ebsConfig.targetAwsAccounts, this.ebsConfig.targetAwsRegion, instanceId);
  }

  async run(instanceId: string): Promise<void> {
    exportSnapshotsFromInstance(this.ebsConfig, instanceId);
  }
}
