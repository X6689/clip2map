const FEEDBACK_TIMEOUT_MS = 10_000;

type MapRequestPayload = {
  email: string;
  city: string;
  videoLinks: string;
  mapType: string;
  notes: string;
  sourcePage: "/create";
  createdAt: string;
  submissionType: "map_request";
  mapTitle: string;
  placeCount: string;
  currentStorage: string;
  preferredInput: string;
};

type ProductFeedbackPayload = {
  email: string;
  city: "";
  videoLinks: "";
  mapType: "feedback";
  notes: string;
  sourcePage: "/feedback";
  createdAt: string;
  submissionType: "product_feedback";
  goal: string;
  confusing: string;
  feature: string;
};

export type FeedbackPayload = MapRequestPayload | ProductFeedbackPayload;

export type FeedbackResult = {
  delivery: "supabase" | "endpoint" | "fallback";
};

function supabaseInsert(payload: FeedbackPayload) {
  if (payload.submissionType === "map_request") {
    return {
      table: "map_requests",
      row: {
        email: payload.email,
        city: payload.city,
        video_links: payload.videoLinks,
        map_type: payload.mapType,
        notes: payload.notes,
        source_page: payload.sourcePage,
        created_at: payload.createdAt,
        map_title: payload.mapTitle,
        place_count: payload.placeCount,
        current_storage: payload.currentStorage,
        preferred_input: payload.preferredInput,
      },
    };
  }

  return {
    table: "feedback",
    row: {
      email: payload.email,
      goal: payload.goal,
      confusing: payload.confusing,
      feature: payload.feature,
      notes: payload.notes,
      source_page: payload.sourcePage,
      created_at: payload.createdAt,
    },
  };
}

async function postJson(
  url: string,
  body: object,
  headers: Record<string, string> = {},
) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), FEEDBACK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        ...headers,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Submission endpoint returned ${response.status}`);
    }
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<FeedbackResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(
    /\/+$/,
    "",
  );
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const endpoint = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT?.trim();
  const endpointApiKey =
    process.env.NEXT_PUBLIC_FEEDBACK_API_KEY?.trim();
  const hasSupabaseConfig = Boolean(supabaseUrl || supabaseAnonKey);
  let lastError: unknown;

  if (supabaseUrl && supabaseAnonKey) {
    const { table, row } = supabaseInsert(payload);

    try {
      await postJson(`${supabaseUrl}/rest/v1/${table}`, row, {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      });
      return { delivery: "supabase" };
    } catch (error) {
      lastError = error;
    }
  } else if (hasSupabaseConfig) {
    lastError = new Error("Supabase URL and anon key must both be configured");
  }

  if (endpoint) {
    try {
      await postJson(
        endpoint,
        payload,
        endpointApiKey
          ? {
              apikey: endpointApiKey,
              Authorization: `Bearer ${endpointApiKey}`,
            }
          : {},
      );
      return { delivery: "endpoint" };
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return { delivery: "fallback" };
}

export function buildMailto(subject: string, body: string) {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Continue to the selection-based fallback below.
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    textarea.remove();
  }
}
