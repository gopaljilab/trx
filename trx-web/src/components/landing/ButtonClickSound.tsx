"use client";

import { useEffect } from "react";
import { LANDING_UI_SOUND_CLASS } from "@/app/landing-material";

const SOUND_SRC = "/button_soft.mp3";

const SOUND_TARGET_SELECTOR = [
  `.${LANDING_UI_SOUND_CLASS}`,
  "button",
  "[role='button']",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
].join(", ");

function shouldPlayForTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  const el = target.closest(SOUND_TARGET_SELECTOR);
  if (!el) return false;
  if (el instanceof HTMLButtonElement) return !el.disabled;
  if (el instanceof HTMLInputElement) return !el.disabled;
  if (el.getAttribute("aria-disabled") === "true") return false;
  return true;
}

/**
 * Plays `/button_soft.mp3` on primary pointer down for real buttons, button-like inputs,
 * `role="button"`, and elements with the `landing-ui-sound` class (CTA links).
 */
export function ButtonClickSound() {
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (!shouldPlayForTarget(e.target)) return;
      try {
        const audio = new Audio(SOUND_SRC);
        audio.volume = 0.32;
        void audio.play().catch(() => {});
      } catch {
        /* ignore */
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  return null;
}
