import { Capacitor, registerPlugin } from "@capacitor/core";
import { canRequestNativeAds, getNativeAdAgeGroup } from "@/lib/native-services";

const TEST_NATIVE_AD_ID = "ca-app-pub-3940256099942544/2247696110";
const PRODUCTION_NATIVE_AD_ID = "ca-app-pub-7847110611874114/5391289366";

interface NativeCatalogueAdPlugin {
  load(options: { adId: string; npa: boolean }): Promise<void>;
  show(options: {
    x: number;
    y: number;
    width: number;
    height: number;
    dark: boolean;
  }): Promise<void>;
  hide(): Promise<void>;
  destroy(): Promise<void>;
}

const NativeCatalogueAd = registerPlugin<NativeCatalogueAdPlugin>("NativeCatalogueAd");

function isTesting(): boolean {
  return import.meta.env["VITE_ADMOB_TEST_MODE"] === "true";
}

export function getNativeCatalogueAdId(): string | null {
  if (!Capacitor.isNativePlatform()) return null;
  if (isTesting()) return TEST_NATIVE_AD_ID;
  return (
    (import.meta.env["VITE_ADMOB_NATIVE_CATALOGUE_ID"] as string | undefined) ||
    PRODUCTION_NATIVE_AD_ID
  );
}

export async function loadNativeCatalogueAd(): Promise<boolean> {
  const adId = getNativeCatalogueAdId();
  const ageGroup = getNativeAdAgeGroup();
  if (!adId || !ageGroup || !canRequestNativeAds()) return false;

  await NativeCatalogueAd.load({
    adId,
    npa: ageGroup === "teen",
  });
  return true;
}

export async function showNativeCatalogueAd(options: {
  x: number;
  y: number;
  width: number;
  height: number;
  dark: boolean;
}): Promise<void> {
  await NativeCatalogueAd.show(options);
}

export async function hideNativeCatalogueAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await NativeCatalogueAd.hide();
}

export async function destroyNativeCatalogueAd(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  await NativeCatalogueAd.destroy();
}
