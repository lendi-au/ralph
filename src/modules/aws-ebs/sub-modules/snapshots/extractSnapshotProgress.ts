export const extractSnapshotProgress = (progressPercentage: string): number => {
  progressPercentage = progressPercentage.replace("%", "").trim();
  const progress = parseInt(progressPercentage);

  if (!progress && progress !== 0) {
    throw new Error("Progress percentage could not be parsed.");
  }
  return progress;
};
