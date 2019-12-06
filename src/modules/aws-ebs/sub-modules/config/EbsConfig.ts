export interface EbsConfig {
  sourceAwsRegion: string;
  quarantineAwsRegion: string;
  quarantineAwsAccounts: string[];
  transferAllSnapshots: boolean;
}
