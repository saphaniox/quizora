import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
} from "@capacitor-community/admob";
import { getPushNotificationPreference, registerPushDevice } from "@/lib/api";

const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";
const PRODUCTION_BANNER_ID = "ca-app-pub-7847110611874114/7228567917";
const PRODUCTION_BANNER_IDS: Record<NativeBannerPlacement, string> = {
  home: "ca-app-pub-7847110611874114/6864153133",
  leaderboard: "ca-app-pub-7847110611874114/3448661465",
  history: "ca-app-pub-7847110611874114/9769603791",
};
const PRODUCTION_INTERSTITIAL_ID = "ca-app-pub-7847110611874114/5029694260";
const AD_AGE_GROUP_KEY = "quitech_ad_age_group_v1";
const INTERSTITIAL_COMPLETION_COUNT_KEY = "quitech_interstitial_completion_count_v1";
const INTERSTITIAL_LAST_SHOWN_KEY = "quitech_interstitial_last_shown_v1";
const INTERSTITIAL_MIN_INTERVAL_MS = 10 * 60 * 1000;
const INTERSTITIAL_COMPLETION_INTERVAL = 2;
const PUSH_REGISTRATION_TIMEOUT_MS = 20_000;

export type AdAgeGroup = "teen" | "adult";
export type NativeBannerPlacement = "home" | "leaderboard" | "history";

let pushListenersReady = false;
let pushActionListenerReady = false;
let pushInitialization: Promise<boolean> | null = null;
let resolvePushRegistration: (() => void) | null = null;
let rejectPushRegistration: ((error: unknown) => void) | null = null;
let adsReady = false;
let adsShouldBeVisible = true;
let requestedBannerPlacement: NativeBannerPlacement | null = null;
let activeBannerId: string | null = null;
let adMobInitialization: Promise<void> | null = null;
let bannerListenersReady = false;
let bannerHeight = 0;
let interstitialReady = false;
let interstitialPreparing: Promise<boolean> | null = null;
let nativeAdRequestsAllowed = false;

function applyBannerInset(): void {
  if (typeof document === "undefined") return;
  document.body.style.paddingBottom =
    adsShouldBeVisible && bannerHeight > 0 ? `${bannerHeight}px` : "";
}

function isAdMobTesting(): boolean {
  return import.meta.env["VITE_ADMOB_TEST_MODE"] === "true";
}

function getBannerId(placement: NativeBannerPlacement): string {
  if (isAdMobTesting()) return TEST_BANNER_ID;

  const placementIds: Record<NativeBannerPlacement, string | undefined> = {
    home: import.meta.env["VITE_ADMOB_BANNER_HOME_ID"] as string | undefined,
    leaderboard: import.meta.env["VITE_ADMOB_BANNER_LEADERBOARD_ID"] as string | undefined,
    history: import.meta.env["VITE_ADMOB_BANNER_HISTORY_ID"] as string | undefined,
  };
  const legacyId = import.meta.env["VITE_ADMOB_BANNER_ID"] as string | undefined;
  return (
    placementIds[placement] || PRODUCTION_BANNER_IDS[placement] || legacyId || PRODUCTION_BANNER_ID
  );
}

export function getNativeAdAgeGroup(): AdAgeGroup | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(AD_AGE_GROUP_KEY);
  return value === "teen" || value === "adult" ? value : null;
}

export function setNativeAdAgeGroup(value: AdAgeGroup): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AD_AGE_GROUP_KEY, value);
}

export function clearNativeAdAgeGroup(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AD_AGE_GROUP_KEY);
}

export function canRequestNativeAds(): boolean {
  return Capacitor.isNativePlatform() && nativeAdRequestsAllowed;
}

function ensureAdMobInitialized(ageGroup: AdAgeGroup): Promise<void> {
  if (!adMobInitialization) {
    adMobInitialization = AdMob.initialize({
      initializeForTesting: isAdMobTesting(),
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: ageGroup === "teen",
      maxAdContentRating: MaxAdContentRating.Teen,
    }).catch((error) => {
      adMobInitialization = null;
      throw error;
    });
  }
  return adMobInitialization;
}

export function enablePushNotifications(requestPermission = false): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return Promise.resolve(false);
  if (pushInitialization) return pushInitialization;

  pushInitialization = initializePushNotifications(requestPermission)
    .catch((error: unknown) => {
      console.warn("Could not enable push notifications", error);
      throw error;
    })
    .finally(() => {
      pushInitialization = null;
    });
  return pushInitialization;
}

export async function syncPushNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { enabled } = await getPushNotificationPreference();
    if (enabled) await enablePushNotifications();
  } catch (error) {
    console.warn("Could not load push notification preference", error);
  }
}

export function initializePushNotificationActions(): void {
  if (!Capacitor.isNativePlatform() || pushActionListenerReady) return;
  pushActionListenerReady = true;
  void PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
    const url = notification.data?.["url"];
    if (
      typeof url === "string" &&
      url.startsWith("/") &&
      !url.startsWith("//") &&
      !url.includes("\\")
    ) {
      window.dispatchEvent(new CustomEvent("quitech:push-navigation", { detail: url }));
    }
  }).catch((error: unknown) => {
    pushActionListenerReady = false;
    console.warn("Could not listen for push notification actions", error);
  });
}

async function initializePushNotifications(requestPermission: boolean): Promise<boolean> {
  if (!pushListenersReady) {
    await PushNotifications.addListener("registration", ({ value }) => {
      const platform = Capacitor.getPlatform();
      if (platform === "android" || platform === "ios") {
        void registerPushDevice(value, platform)
          .then(() => resolvePushRegistration?.())
          .catch((error: unknown) => {
            console.warn("Could not register push device", error);
            rejectPushRegistration?.(error);
          });
      }
    });
    await PushNotifications.addListener("registrationError", (error) => {
      console.warn("Push registration failed", error);
      rejectPushRegistration?.(new Error(error.error));
    });
    pushListenersReady = true;
  }

  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === "prompt") {
    if (!requestPermission) return false;
    permission = await PushNotifications.requestPermissions();
  }
  if (permission.receive !== "granted") return false;

  if (Capacitor.getPlatform() === "android") {
    await PushNotifications.createChannel({
      id: "quitech_updates",
      name: "Quitech updates",
      description: "Learning reminders, achievements, and important account updates",
      importance: 4,
      visibility: 1,
      vibration: true,
    });
  }

  const registration = new Promise<void>((resolve, reject) => {
    const timeout = globalThis.setTimeout(() => {
      resolvePushRegistration = null;
      rejectPushRegistration = null;
      reject(new Error("Timed out waiting for this device to register for push notifications."));
    }, PUSH_REGISTRATION_TIMEOUT_MS);
    resolvePushRegistration = () => {
      globalThis.clearTimeout(timeout);
      resolvePushRegistration = null;
      rejectPushRegistration = null;
      resolve();
    };
    rejectPushRegistration = (error: unknown) => {
      globalThis.clearTimeout(timeout);
      resolvePushRegistration = null;
      rejectPushRegistration = null;
      reject(error);
    };
  });

  try {
    await Promise.all([PushNotifications.register(), registration]);
  } catch (error) {
    rejectPushRegistration?.(error);
    throw error;
  }
  return true;
}

export async function initializeNativeAds(): Promise<void> {
  if (!Capacitor.isNativePlatform() || adsReady) return;

  const ageGroup = getNativeAdAgeGroup();
  if (!ageGroup) return;

  adsReady = true;
  try {
    await ensureAdMobInitialized(ageGroup);
    if (!bannerListenersReady) {
      bannerListenersReady = true;
      await AdMob.addListener(BannerAdPluginEvents.SizeChanged, ({ height }) => {
        bannerHeight = Math.max(0, height);
        applyBannerInset();
      });
      await AdMob.addListener(BannerAdPluginEvents.FailedToLoad, () => {
        bannerHeight = 0;
        applyBannerInset();
      });
    }
    let consent = await AdMob.requestConsentInfo({
      tagForUnderAgeOfConsent: ageGroup === "teen",
    });
    if (consent.status === AdmobConsentStatus.REQUIRED && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }
    if (!consent.canRequestAds) {
      adsReady = false;
      return;
    }
    nativeAdRequestsAllowed = true;
    window.dispatchEvent(new Event("quitech-native-ads-ready"));
    await syncNativeBanner();
  } catch (error) {
    adsReady = false;
    console.warn("AdMob initialization failed", error);
  }
}

async function syncNativeBanner(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !adsReady) return;

  if (!requestedBannerPlacement) {
    adsShouldBeVisible = false;
    applyBannerInset();
    if (activeBannerId) await AdMob.hideBanner();
    return;
  }

  const ageGroup = getNativeAdAgeGroup();
  if (!ageGroup) return;

  adsShouldBeVisible = true;
  const adId = getBannerId(requestedBannerPlacement);
  if (activeBannerId === adId) {
    await AdMob.resumeBanner();
    applyBannerInset();
    return;
  }

  if (activeBannerId) {
    await AdMob.removeBanner();
    activeBannerId = null;
    bannerHeight = 0;
  }
  await AdMob.showBanner({
    adId,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    isTesting: isAdMobTesting(),
    npa: ageGroup === "teen",
    margin: 0,
  });
  activeBannerId = adId;
  applyBannerInset();
}

export async function openNativePrivacyChoices(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  const ageGroup = getNativeAdAgeGroup();
  if (!ageGroup) return false;

  await ensureAdMobInitialized(ageGroup);
  const consent = await AdMob.requestConsentInfo({
    tagForUnderAgeOfConsent: ageGroup === "teen",
  });
  if (consent.privacyOptionsRequirementStatus !== "REQUIRED") {
    return false;
  }
  await AdMob.showPrivacyOptionsForm();
  return true;
}

function getInterstitialId(): string | null {
  const configuredId = import.meta.env["VITE_ADMOB_INTERSTITIAL_ID"] as string | undefined;
  return isAdMobTesting() ? TEST_INTERSTITIAL_ID : configuredId || PRODUCTION_INTERSTITIAL_ID;
}

export function isNativeQuizInterstitialConfigured(): boolean {
  return Capacitor.isNativePlatform() && Boolean(getInterstitialId());
}

export async function prepareNativeQuizInterstitial(): Promise<boolean> {
  if (!isNativeQuizInterstitialConfigured()) return false;
  if (interstitialReady) return true;
  if (interstitialPreparing) return interstitialPreparing;

  const ageGroup = getNativeAdAgeGroup();
  const adId = getInterstitialId();
  if (!ageGroup || !adId) return false;

  interstitialPreparing = (async () => {
    try {
      await ensureAdMobInitialized(ageGroup);
      const consent = await AdMob.requestConsentInfo({
        tagForUnderAgeOfConsent: ageGroup === "teen",
      });
      if (!consent.canRequestAds) return false;
      await AdMob.prepareInterstitial({
        adId,
        isTesting: isAdMobTesting(),
        npa: ageGroup === "teen",
      });
      interstitialReady = true;
      return true;
    } catch (error) {
      console.warn("Interstitial preparation failed", error);
      return false;
    } finally {
      interstitialPreparing = null;
    }
  })();

  return interstitialPreparing;
}

function readStoredNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export async function maybeShowNativeQuizInterstitial(): Promise<boolean> {
  if (!isNativeQuizInterstitialConfigured() || typeof window === "undefined") return false;

  const completionCount = readStoredNumber(INTERSTITIAL_COMPLETION_COUNT_KEY) + 1;
  window.localStorage.setItem(INTERSTITIAL_COMPLETION_COUNT_KEY, String(completionCount));

  const lastShownAt = readStoredNumber(INTERSTITIAL_LAST_SHOWN_KEY);
  const intervalElapsed = Date.now() - lastShownAt >= INTERSTITIAL_MIN_INTERVAL_MS;
  if (completionCount < INTERSTITIAL_COMPLETION_INTERVAL || !intervalElapsed) {
    void prepareNativeQuizInterstitial();
    return false;
  }

  if (!interstitialReady) {
    void prepareNativeQuizInterstitial();
    return false;
  }

  const adId = getInterstitialId();
  if (!adId) return false;

  interstitialReady = false;
  try {
    await AdMob.showInterstitial({ adId });
    window.localStorage.setItem(INTERSTITIAL_COMPLETION_COUNT_KEY, "0");
    window.localStorage.setItem(INTERSTITIAL_LAST_SHOWN_KEY, String(Date.now()));
    return true;
  } catch (error) {
    console.warn("Interstitial display failed", error);
    return false;
  }
}

export async function setNativeBannerPlacement(
  placement: NativeBannerPlacement | null,
): Promise<void> {
  requestedBannerPlacement = placement;
  try {
    await syncNativeBanner();
  } catch {
    // A route can change while an ad is loading. The next route update retries the placement.
  }
}
