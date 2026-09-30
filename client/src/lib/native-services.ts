import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import {
  AdMob,
  AdmobConsentStatus,
  BannerAdPosition,
  BannerAdSize,
  MaxAdContentRating,
} from "@capacitor-community/admob";
import { registerPushDevice } from "@/lib/api";

const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
let pushListenersReady = false;
let adsReady = false;
let adsShouldBeVisible = true;

export async function enablePushNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  if (!pushListenersReady) {
    pushListenersReady = true;
    await PushNotifications.addListener("registration", ({ value }) => {
      const platform = Capacitor.getPlatform();
      if (platform === "android" || platform === "ios") {
        void registerPushDevice(value, platform).catch(() => undefined);
      }
    });
    await PushNotifications.addListener("registrationError", (error) => {
      console.warn("Push registration failed", error);
    });
    await PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
      const url = notification.data?.["url"];
      if (typeof url === "string" && url.startsWith("/") && !url.startsWith("//")) {
        window.location.assign(url);
      }
    });
  }

  let permission = await PushNotifications.checkPermissions();
  if (permission.receive === "prompt") {
    permission = await PushNotifications.requestPermissions();
  }
  if (permission.receive !== "granted") return;

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
  await PushNotifications.register();
}

export async function initializeNativeAds(): Promise<void> {
  if (!Capacitor.isNativePlatform() || adsReady) return;

  const isTesting = import.meta.env["VITE_ADMOB_TEST_MODE"] === "true";
  const configuredId = import.meta.env["VITE_ADMOB_BANNER_ID"] as string | undefined;
  const adId = configuredId || (isTesting ? TEST_BANNER_ID : undefined);
  if (!adId) return;

  adsReady = true;
  try {
    await AdMob.initialize({
      initializeForTesting: isTesting,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      maxAdContentRating: MaxAdContentRating.Teen,
    });
    let consent = await AdMob.requestConsentInfo();
    if (consent.status === AdmobConsentStatus.REQUIRED && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }
    if (!consent.canRequestAds) return;
    await AdMob.showBanner({
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting,
      margin: 0,
    });
    if (!adsShouldBeVisible) await AdMob.hideBanner();
  } catch (error) {
    adsReady = false;
    console.warn("AdMob initialization failed", error);
  }
}

export async function setNativeAdsVisible(visible: boolean): Promise<void> {
  adsShouldBeVisible = visible;
  if (!Capacitor.isNativePlatform() || !adsReady) return;
  try {
    if (visible) await AdMob.resumeBanner();
    else await AdMob.hideBanner();
  } catch {
    // The banner may still be loading; initializeNativeAds applies the latest visibility.
  }
}
