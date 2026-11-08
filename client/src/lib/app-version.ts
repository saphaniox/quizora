export const APP_VERSION = "2.16";

export function compareVersions(current: string, target: string): number {
  const normalize = (value: string): [number, number, number] => {
    const parts = value
      .trim()
      .split(".")
      .map((part) => Number.parseInt(part.replace(/[^0-9]/g, ""), 10) || 0)
      .slice(0, 3);
    return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
  };

  const currentParts = normalize(current);
  const targetParts = normalize(target);

  for (let index = 0; index < 3; index += 1) {
    const currentPart = currentParts[index] ?? 0;
    const targetPart = targetParts[index] ?? 0;
    if (currentPart < targetPart) return -1;
    if (currentPart > targetPart) return 1;
  }

  return 0;
}

export function isUpdateRequired(
  current: string,
  minimumVersion: string,
  latestVersion: string,
): boolean {
  return (
    compareVersions(current, minimumVersion) < 0 || compareVersions(current, latestVersion) < 0
  );
}
