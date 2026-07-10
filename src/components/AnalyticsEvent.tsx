"use client";

import { useEffect } from "react";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics";

type AnalyticsEventProps = {
  name: AnalyticsEventName;
  properties?: AnalyticsProperties;
};

export function AnalyticsEvent({ name, properties }: AnalyticsEventProps) {
  useEffect(() => {
    trackEvent(name, properties);
  }, [name, properties]);

  return null;
}
