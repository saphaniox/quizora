import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

const task = process.argv[2];

if (!task) {
  console.error("Usage: node scripts/android-build.mjs <gradle-task>");
  process.exit(1);
}

const clientRoot = process.cwd();
const androidDir = join(clientRoot, "android");
const isWindows = process.platform === "win32";

const getCachedGradleCommand = () => {
  const homeDir = process.env.USERPROFILE ?? process.env.HOME;
  if (!homeDir) {
    return undefined;
  }

  const wrapperPropertiesPath = join(
    androidDir,
    "gradle",
    "wrapper",
    "gradle-wrapper.properties",
  );

  if (!existsSync(wrapperPropertiesPath)) {
    return undefined;
  }

  const wrapperProperties = readFileSync(wrapperPropertiesPath, "utf8");
  const distributionMatch = wrapperProperties.match(/gradle-([\d.]+)-(bin|all)\.zip/);
  if (!distributionMatch) {
    return undefined;
  }

  const [, version, distributionType] = distributionMatch;
  const distributionName = `gradle-${version}-${distributionType}`;
  const distributionRoot = join(homeDir, ".gradle", "wrapper", "dists", distributionName);

  if (!existsSync(distributionRoot)) {
    return undefined;
  }

  for (const cacheKey of readdirSync(distributionRoot)) {
    const candidate = join(
      distributionRoot,
      cacheKey,
      `gradle-${version}`,
      "bin",
      isWindows ? "gradle.bat" : "gradle",
    );

    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
};

const gradleCommand = getCachedGradleCommand() ?? (isWindows ? "gradlew.bat" : "./gradlew");

const javaHomeCandidates = [
  isWindows ? "C:\\Program Files\\Android\\Android Studio\\jbr" : undefined,
  isWindows ? "C:\\Program Files\\Android\\Android Studio\\jre" : undefined,
  "/Applications/Android Studio.app/Contents/jbr/Contents/Home",
  "/opt/android-studio/jbr",
  process.env.JAVA_HOME,
].filter(Boolean);

const javaHome = javaHomeCandidates.find((candidate) =>
  existsSync(join(candidate, "bin", isWindows ? "java.exe" : "java")),
);

const env = { ...process.env };
if (javaHome) {
  env.JAVA_HOME = javaHome;
  env.PATH = `${join(javaHome, "bin")}${isWindows ? ";" : ":"}${env.PATH ?? ""}`;
}

const result = spawnSync(
  gradleCommand,
  [task, "--console=plain", "--warning-mode=summary"],
  {
    cwd: androidDir,
    env,
    stdio: "inherit",
    shell: isWindows,
  },
);

process.exit(result.status ?? 1);
