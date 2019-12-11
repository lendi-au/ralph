import { AwsRegion } from "./AwsRegion";

export const extractAwsRegion = (region: string): AwsRegion => {
  const regionKey = Object.keys(AwsRegion).find(key => {
    return AwsRegion[key as keyof typeof AwsRegion] === region;
  });

  if (!regionKey) {
    throw new Error(`${region} is not a valid AWS region.`);
  }

  const returnRegion: AwsRegion = AwsRegion[regionKey as keyof typeof AwsRegion];
  return returnRegion;
};
