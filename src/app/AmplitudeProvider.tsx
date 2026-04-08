"use client";

import { useEffect } from "react";
import * as amplitude from "@amplitude/unified";

export default function AmplitudeProvider() {
  useEffect(() => {
    amplitude.initAll("3c51c0cc2a736afad47c8a17e36d67c8", {
      analytics: { autocapture: true },
      sessionReplay: { sampleRate: 1 },
    });
  }, []);

  return null;
}
