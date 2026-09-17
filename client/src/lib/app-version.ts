export const APP_VERSION = "2.4";

export function compareVersions(current: string, target: string): number {
  const normalize = (value: string) =>
    value
      .trim()
      .split(".")
      .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ""), 10) || 0)
      .slice(0, 3)
      .concat([0, 0, 0])
      .slice(0, 3);

  const currentParts = normalize(current);
  const targetParts = normalize(target);

  for (let index = 0; index < 3; index += 1) {
    if (currentParts[index] < targetParts[index]) return -1;
    if (currentParts[index] > targetParts[index]) return 1;
  }

  return 0;
}

export function isUpdateRequired(current: string, minimumVersion: string, latestVersion: string): boolean {
  return compareVersions(current, minimumVersion) < 0 || compareVersions(current, latestVersion) < 0;
}
