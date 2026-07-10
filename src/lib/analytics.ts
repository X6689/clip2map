export const analyticsEvents = [
  "landing_viewed",
  "demo_map_opened",
  "create_map_clicked",
  "map_link_copied",
  "category_filter_used",
  "place_card_selected",
  "map_request_started",
  "map_request_submitted",
  "feedback_submitted",
] as const;

export type AnalyticsEventName = (typeof analyticsEvents)[number];
export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export function trackEvent(
  name: AnalyticsEventName,
  properties: AnalyticsProperties = {},
) {
  if (process.env.NODE_ENV === "development") {
    console.info("[Clip2Map analytics]", { name, properties });
  }

  // Future analytics adapters should be connected here without changing callers.
}
