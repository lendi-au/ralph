import { extractSnapshotProgress } from "./extractSnapshotProgress";

describe("extractSnapshotProgress()", () => {
  it("should extract progress successfully when params are valid", () => {
    [
      { params: "0%", output: 0 },
      { params: "25%", output: 25 },
      { params: "50%", output: 50 },
      { params: "75%", output: 75 },
    ].forEach(testCase => {
      expect(extractSnapshotProgress(testCase.params)).toEqual(testCase.output);
    });
  });

  it("should throw an error if parameter is malformed", () => {
    const errorMessage = "Progress percentage could not be parsed.";

    ["z0%", "z140%", "x50%", "z75%"].forEach(param => {
      expect(() => {
        extractSnapshotProgress(param);
      }).toThrow(errorMessage);
    });
  });
});
