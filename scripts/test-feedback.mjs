import assert from "node:assert/strict";
import { submitFeedback } from "../src/lib/feedback.ts";

globalThis.window = {
  setTimeout,
  clearTimeout,
};

const mapRequest = {
  email: "map@example.com",
  city: "Tokyo",
  videoLinks: "https://example.com/short",
  mapType: "Restaurants",
  notes: "Map notes",
  sourcePage: "/create",
  createdAt: "2026-07-10T00:00:00.000Z",
  submissionType: "map_request",
  mapTitle: "Tokyo map",
  placeCount: "1-5",
  currentStorage: "TikTok",
  preferredInput: "Paste social media links",
};

const productFeedback = {
  email: "feedback@example.com",
  city: "",
  videoLinks: "",
  mapType: "feedback",
  notes: "Structured feedback",
  sourcePage: "/feedback",
  createdAt: "2026-07-10T00:00:00.000Z",
  submissionType: "product_feedback",
  goal: "Build a food map",
  confusing: "Nothing",
  feature: "Paste social media links",
};

function configure({ supabase = true, endpoint = true } = {}) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = supabase
    ? "https://project.supabase.co"
    : "";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = supabase ? "anon-key" : "";
  process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT = endpoint
    ? "https://fallback.example.com/submissions"
    : "";
  process.env.NEXT_PUBLIC_FEEDBACK_API_KEY = "";
}

async function testSupabaseMapRequest() {
  configure();
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 201 };
  };

  const result = await submitFeedback(mapRequest);
  assert.deepEqual(result, { delivery: "supabase" });
  assert.equal(calls.length, 1);
  assert.equal(
    calls[0].url,
    "https://project.supabase.co/rest/v1/map_requests",
  );
  assert.equal(calls[0].options.headers.apikey, "anon-key");
  const row = JSON.parse(calls[0].options.body);
  assert.equal(row.video_links, mapRequest.videoLinks);
  assert.equal(row.map_title, mapRequest.mapTitle);
  assert.equal("videoLinks" in row, false);
}

async function testSupabaseFeedback() {
  configure();
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return { ok: true, status: 201 };
  };

  const result = await submitFeedback(productFeedback);
  assert.deepEqual(result, { delivery: "supabase" });
  assert.equal(
    calls[0].url,
    "https://project.supabase.co/rest/v1/feedback",
  );
  const row = JSON.parse(calls[0].options.body);
  assert.equal(row.goal, productFeedback.goal);
  assert.equal(row.source_page, "/feedback");
}

async function testEndpointFallback() {
  configure();
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url.includes("supabase.co")
      ? { ok: false, status: 503 }
      : { ok: true, status: 201 };
  };

  const result = await submitFeedback(mapRequest);
  assert.deepEqual(result, { delivery: "endpoint" });
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, "https://fallback.example.com/submissions");
  assert.deepEqual(JSON.parse(calls[1].options.body), mapRequest);
}

async function testCopyFallbackAfterBothFail() {
  configure();
  globalThis.fetch = async () => ({ ok: false, status: 503 });
  await assert.rejects(() => submitFeedback(mapRequest));
}

async function testUnconfiguredFallback() {
  configure({ supabase: false, endpoint: false });
  globalThis.fetch = async () => {
    throw new Error("fetch should not run");
  };
  const result = await submitFeedback(mapRequest);
  assert.deepEqual(result, { delivery: "fallback" });
}

await testSupabaseMapRequest();
await testSupabaseFeedback();
await testEndpointFallback();
await testCopyFallbackAfterBothFail();
await testUnconfiguredFallback();

console.log("5 feedback delivery tests passed.");
