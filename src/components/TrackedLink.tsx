"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import {
  trackEvent,
  type AnalyticsEventName,
  type AnalyticsProperties,
} from "@/lib/analytics";

type TrackedLinkProps = Omit<ComponentProps<typeof Link>, "onClick"> & {
  eventName: AnalyticsEventName;
  eventProperties?: AnalyticsProperties;
};

export function TrackedLink({
  eventName,
  eventProperties,
  ...linkProps
}: TrackedLinkProps) {
  return (
    <Link
      {...linkProps}
      onClick={() => trackEvent(eventName, eventProperties)}
    />
  );
}
