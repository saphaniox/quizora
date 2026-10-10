import { useEffect, useRef } from "react";
import { BadgeInfo } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import {
  destroyNativeCatalogueAd,
  getNativeCatalogueAdId,
  hideNativeCatalogueAd,
  loadNativeCatalogueAd,
  showNativeCatalogueAd,
} from "@/lib/native-catalogue-ad";

const adSlots = new Set<HTMLElement>();
let activeSlot: HTMLElement | null = null;
let loadedSlot: HTMLElement | null = null;
let adLoaded = false;
let animationFrame: number | null = null;
let resizeObserver: ResizeObserver | null = null;
let reconciliationRunning = false;
let listenersAttached = false;

function findVisibleSlot(): HTMLElement | null {
  if (document.visibilityState !== "visible") return null;

  let visibleSlot: HTMLElement | null = null;
  let largestVisibleArea = 0;

  for (const slot of adSlots) {
    const rect = slot.getBoundingClientRect();
    const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
    const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    const visibleArea = width * height;

    if (visibleArea > largestVisibleArea) {
      visibleSlot = slot;
      largestVisibleArea = visibleArea;
    }
  }

  return visibleSlot;
}

function getDarkMode(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

async function positionAd(slot: HTMLElement): Promise<void> {
  const rect = slot.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  try {
    await showNativeCatalogueAd({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      dark: getDarkMode(),
    });
  } catch (error) {
    console.warn("Native catalogue ad failed to display", error);
  }
}

async function hideAd(): Promise<void> {
  try {
    await hideNativeCatalogueAd();
  } catch (error) {
    console.warn("Native catalogue ad failed to hide", error);
  }
}

async function reconcileAd(): Promise<void> {
  if (reconciliationRunning) return;
  reconciliationRunning = true;

  try {
    while (true) {
      const nextSlot = activeSlot;

      if (nextSlot === loadedSlot) {
        if (nextSlot && adLoaded) await positionAd(nextSlot);
        if (activeSlot === nextSlot) return;
        continue;
      }

      await hideAd();
      loadedSlot = null;
      adLoaded = false;

      if (!nextSlot) {
        if (activeSlot === null) return;
        continue;
      }

      if (activeSlot !== nextSlot) continue;

      try {
        const didLoad = await loadNativeCatalogueAd();
        if (activeSlot !== nextSlot) continue;
        loadedSlot = nextSlot;
        adLoaded = didLoad;
        if (didLoad) await positionAd(nextSlot);
      } catch (error) {
        console.warn("Native catalogue ad failed to load", error);
        loadedSlot = nextSlot;
        adLoaded = false;
      }
    }
  } finally {
    reconciliationRunning = false;
    if (activeSlot !== loadedSlot) void reconcileAd();
  }
}

function updateActiveSlot(): void {
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = null;
    activeSlot = findVisibleSlot();
    void reconcileAd();
  });
}

function retryActiveAd(): void {
  loadedSlot = null;
  adLoaded = false;
  updateActiveSlot();
}

function attachListeners(): void {
  if (listenersAttached) return;
  listenersAttached = true;
  window.addEventListener("scroll", updateActiveSlot, true);
  window.addEventListener("resize", updateActiveSlot);
  document.addEventListener("visibilitychange", updateActiveSlot);
  window.addEventListener("quitech-native-ads-ready", retryActiveAd);
  resizeObserver = new ResizeObserver(updateActiveSlot);
  updateActiveSlot();
}

function detachListeners(): void {
  if (!listenersAttached) return;
  listenersAttached = false;
  window.removeEventListener("scroll", updateActiveSlot, true);
  window.removeEventListener("resize", updateActiveSlot);
  document.removeEventListener("visibilitychange", updateActiveSlot);
  window.removeEventListener("quitech-native-ads-ready", retryActiveAd);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
  animationFrame = null;
  activeSlot = null;
  loadedSlot = null;
  adLoaded = false;
  void hideAd();
  void destroyNativeCatalogueAd().catch((error: unknown) => {
    console.warn("Native catalogue ad failed to destroy", error);
  });
}

function registerSlot(slot: HTMLElement): () => void {
  adSlots.add(slot);
  attachListeners();
  resizeObserver?.observe(slot);

  return () => {
    adSlots.delete(slot);
    resizeObserver?.unobserve(slot);
    if (adSlots.size === 0) detachListeners();
    else updateActiveSlot();
  };
}

export function NativeCatalogueAd() {
  const adSurfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = adSurfaceRef.current;
    if (!surface || !Capacitor.isNativePlatform() || !getNativeCatalogueAdId()) return;
    return registerSlot(surface);
  }, []);

  if (!Capacitor.isNativePlatform() || !getNativeCatalogueAdId()) return null;

  return (
    <aside
      aria-label="Advertisement"
      className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm sm:col-span-2 lg:col-span-3"
    >
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-muted/40 px-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <BadgeInfo className="h-3.5 w-3.5" />
          Advertisement
        </span>
        <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Ad
        </span>
      </div>
      <div ref={adSurfaceRef} aria-hidden="true" className="h-[320px] min-w-0 bg-background" />
    </aside>
  );
}
