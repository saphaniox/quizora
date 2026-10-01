import { useCallback, useEffect, useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";

import {
  destroyNativeCatalogueAd,
  getNativeCatalogueAdId,
  hideNativeCatalogueAd,
  loadNativeCatalogueAd,
  showNativeCatalogueAd,
} from "@/lib/native-catalogue-ad";

export function NativeCatalogueAd() {
  const containerRef = useRef<HTMLElement>(null);
  const loadingRef = useRef(false);
  const loadedRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  const positionAd = useCallback(() => {
    if (!loaded || !containerRef.current) return;
    if (document.visibilityState !== "visible") {
      void hideNativeCatalogueAd();
      return;
    }
    if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) {
        void hideNativeCatalogueAd();
        return;
      }
      const dark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      void showNativeCatalogueAd({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        dark,
      });
    });
  }, [loaded]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !getNativeCatalogueAdId()) return;
    let active = true;

    const tryLoad = async () => {
      if (loadingRef.current || loadedRef.current) return;
      loadingRef.current = true;
      try {
        const didLoad = await loadNativeCatalogueAd();
        if (active && didLoad) {
          loadedRef.current = true;
          setLoaded(true);
        }
      } catch (error) {
        console.warn("Native catalogue ad failed to load", error);
      } finally {
        loadingRef.current = false;
      }
    };

    void tryLoad();
    window.addEventListener("quitech-native-ads-ready", tryLoad);
    return () => {
      active = false;
      window.removeEventListener("quitech-native-ads-ready", tryLoad);
      void destroyNativeCatalogueAd();
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(positionAd);
    observer.observe(container);
    window.addEventListener("scroll", positionAd, true);
    window.addEventListener("resize", positionAd);
    document.addEventListener("visibilitychange", positionAd);
    positionAd();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", positionAd, true);
      window.removeEventListener("resize", positionAd);
      document.removeEventListener("visibilitychange", positionAd);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      void hideNativeCatalogueAd();
    };
  }, [loaded, positionAd]);

  if (!loaded) return null;

  return (
    <aside
      ref={containerRef}
      aria-label="Advertisement"
      className="h-[360px] min-w-0 overflow-hidden rounded-lg border border-border bg-card"
    />
  );
}
