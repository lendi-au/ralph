import { AwsRegion } from "../../../region/AwsRegion";

export interface EbsConfig {
  sourceAwsRegion: AwsRegion;
  quarantineAwsRegion: AwsRegion;
  quarantineAwsAccounts: string[];
  transferAllSnapshots: boolean;
}
