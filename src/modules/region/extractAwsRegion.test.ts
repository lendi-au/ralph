import { extractAwsRegion } from "./extractAwsRegion";
import { AwsRegion } from "./AwsRegion";

describe("extractRegion()", () => {
  it("should return the enum value if it is a valid region", () => {
    [
      ["eu-north-1", AwsRegion.EU_NORTH_1],
      ["ap-south-1", AwsRegion.AP_SOUTH_1],
      ["eu-west-3", AwsRegion.EU_WEST_3],
      ["eu-west-2", AwsRegion.EU_WEST_2],
      ["eu-west-1", AwsRegion.EU_WEST_1],
      ["ap-northeast-2", AwsRegion.AP_NORTHEAST_2],
      ["me-south-1", AwsRegion.ME_SOUTH_1],
      ["ap-northeast-1", AwsRegion.AP_NORTHEAST_1],
      ["sa-east-1", AwsRegion.SA_EAST_1],
      ["ca-central-1", AwsRegion.CA_CENTRAL_1],
      ["ap-east-1", AwsRegion.AP_EAST_1],
      ["ap-southeast-1", AwsRegion.AP_SOUTHEAST_1],
      ["ap-southeast-2", AwsRegion.AP_SOUTHEAST_2],
      ["eu-central-1", AwsRegion.EU_CENTRAL_1],
      ["us-east-1", AwsRegion.US_EAST_1],
      ["us-east-2", AwsRegion.US_EAST_2],
      ["us-west-1", AwsRegion.US_WEST_1],
      ["us-west-2", AwsRegion.US_WEST_2],
    ].forEach(region => {
      expect(extractAwsRegion(region[0])).toEqual(region[1]);
    });
  });

  it("should throw an error if the enum value is not a valid region", () => {
    ["antartica-1", "north-pole-1", "mars-1"].forEach(region => {
      expect(() => {
        extractAwsRegion(region);
      }).toThrow(`${region} is not a valid AWS region.`);
    });
  });
});
