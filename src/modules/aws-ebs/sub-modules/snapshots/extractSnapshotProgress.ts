export const extractSnapshotProgress = (progressPercentage: string): number => {
  progressPercentage = progressPercentage.replace("%", "");
  return parseInt(progressPercentage);
};
