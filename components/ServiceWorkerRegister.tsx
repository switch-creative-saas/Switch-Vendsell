"use client";
import { useEffect } from "react";
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("Service worker registration failed:", err);
        });
      });
    }
  }, []);
  return null;
} 