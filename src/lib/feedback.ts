const FEEDBACK_TIMEOUT_MS = 10_000;

export type FeedbackPayload = {
  email: string;
  city: string;
  videoLinks: string;
  mapType: string;
  notes: string;
  sourcePage: "/create" | "/feedback";
  createdAt: string;
  submissionType: "map_request" | "product_feedback";
  [key: string]: string;
};

export type FeedbackResult =
  | { delivery: "endpoint" }
  | { delivery: "fallback" };

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<FeedbackResult> {
  const endpoint = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT?.trim();
  const apiKey = process.env.NEXT_PUBLIC_FEEDBACK_API_KEY?.trim();

  if (!endpoint) {
    return { delivery: "fallback" };
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), FEEDBACK_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal",
        ...(apiKey
          ? { apikey: apiKey, Authorization: `Bearer ${apiKey}` }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Feedback endpoint returned ${response.status}`);
    }

    return { delivery: "endpoint" };
  } finally {
    window.clearTimeout(timeout);
  }
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
