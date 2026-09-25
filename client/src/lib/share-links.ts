const ANDROID_PACKAGE_ID = "com.saptechug.quitech";

export const androidAppUrl = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

export function webAppUrl(path = "") {
  if (typeof window === "undefined") return path || "/";
  return `${window.location.origin}${path}`;
}

export function appLinksText() {
  return `Android app: ${androidAppUrl}\nWeb app: ${webAppUrl()}`;
}
