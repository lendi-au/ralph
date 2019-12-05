export interface EbsConfig {
  sourceAwsRegion: string;
  targetAwsRegion: string;
  targetAwsAccounts: string[];
  transferAllSnapshots: boolean;
}
