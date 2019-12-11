import * as loadEbsConfig from "./sub-modules/config/loadEbsConfig";
import * as sinon from "sinon";
import { EbsConfig } from "./sub-modules/config/EbsConfig";
import * as describeExportEbsSnapshotsPlan from "./sub-modules/snapshots/describeExportEbsSnapshotsPlan";
import * as exportSnapshots from "./sub-modules/snapshots/exportSnapshots";
import { ExportEbsSnapshots } from "./ExportEbsSnapshots";
import { AwsRegion } from "../region/AwsRegion";

describe("ExportEbsSnaphot.describeAction()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should load ebs config and call describeExportEbsSnapshotsPlan with ebsConfig and instanceId as params", () => {
    const instanceId = "i-000";
    const ebsConfig: EbsConfig = {
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_1,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: ["000", "001"],
      transferAllSnapshots: true,
    };
    const spyLoadEbsConfig = sinon.stub(loadEbsConfig, "loadEbsConfig");
    spyLoadEbsConfig.returns(ebsConfig);

    const spyDescribeExportEbsSnapshotsPlan = sinon.stub(
      describeExportEbsSnapshotsPlan,
      "describeExportEbsSnapshotsPlan",
    );
    spyDescribeExportEbsSnapshotsPlan.resolves();

    const runbook = new ExportEbsSnapshots();
    runbook.describeAction(instanceId);

    expect(spyLoadEbsConfig.calledOnce).toBe(true);
    expect(spyDescribeExportEbsSnapshotsPlan.withArgs(ebsConfig, instanceId).calledOnce).toBe(true);
  });
});

describe("ExportEbsSnaphot.run()", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should load ebs config and call exportSnapshotsFromInstance with ebsConfig and instanceId as params", () => {
    const instanceId = "i-000";
    const ebsConfig: EbsConfig = {
      sourceAwsRegion: AwsRegion.AP_SOUTHEAST_1,
      quarantineAwsRegion: AwsRegion.AP_SOUTHEAST_2,
      quarantineAwsAccounts: ["000", "001"],
      transferAllSnapshots: true,
    };
    const spyLoadEbsConfig = sinon.stub(loadEbsConfig, "loadEbsConfig");
    spyLoadEbsConfig.returns(ebsConfig);

    const spyExportSnapshotsFromInstance = sinon.stub(exportSnapshots, "exportSnapshotsFromInstance");
    spyExportSnapshotsFromInstance.resolves();

    const runbook = new ExportEbsSnapshots();
    runbook.run(instanceId);

    expect(spyLoadEbsConfig.calledOnce).toBe(true);
    expect(spyExportSnapshotsFromInstance.withArgs(ebsConfig, instanceId).calledOnce).toBe(true);
  });
});
