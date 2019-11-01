module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
  testPathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"]
};
