const BASE_URL = process.env.YELLOWCAKE_BASE_URL || "https://api.yellowcake.dev";
const API_KEY = process.env.YELLOWCAKE_API_KEY || "AIzaSyAoIwdCkCoeFXyEGroGlkJw-fSFDo2sPC0"

if (!API_KEY) throw new Error("Missing YELLOWCAKE_API_KEY in .env");

const DEFAULT_TIMEOUT_MS = Number(process.env.YELLOWCAKE_TIMEOUT_MS || 15 * 60 * 1000);

/**
 * Read SSE stream until we get `event: complete`.
 * Return parsed JSON from the `data:` lines of that complete event.
 */
async function readSSEUntilComplete(readableStream, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const reader = readableStream.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  const timeoutAt = Date.now() + timeoutMs;

  while (true) {
    if (Date.now() > timeoutAt) {
      throw new Error(`Yellowcake SSE timed out after ${timeoutMs}ms (no complete event).`);
    }

    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE events separated by blank line
    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      const lines = rawEvent.split("\n").map(l => l.trimEnd());
      let eventName = null;
      const dataLines = [];

      for (const line of lines) {
        if (line.startsWith("event:")) eventName = line.slice("event:".length).trim();
        if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trim());
      }

      if (eventName === "complete") {
        const dataStr = dataLines.join("\n").trim();
        try {
          return JSON.parse(dataStr);
        } catch (e) {
          throw new Error(`Failed to parse Yellowcake complete JSON: ${e?.message || e}`);
        }
      }
    }
  }

  throw new Error(`Yellowcake stream ended without "complete" event.`);
}

/**
 * Calls Yellowcake extract-stream and returns the final complete payload JSON.
 */
export async function yellowcakeExtractStream({
  url,
  prompt,
  throttleMode,
  loginURL,
  authorizedURLs
}) {
  const endpoint = `${BASE_URL}/v1/extract-stream`;

  const body = { url, prompt };
  if (typeof throttleMode === "boolean") body.throttleMode = throttleMode;
  if (loginURL) body.loginURL = loginURL;
  if (Array.isArray(authorizedURLs)) body.authorizedURLs = authorizedURLs;

  // Send both headers (docs show X-API-Key, some examples show Authorization)
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": API_KEY,
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Yellowcake HTTP ${res.status}: ${txt || res.statusText}`);
  }
  if (!res.body) throw new Error("Yellowcake response missing body stream.");

  return readSSEUntilComplete(res.body, { timeoutMs: DEFAULT_TIMEOUT_MS });
}

export async function withRetries(fn, { retries = 2, baseDelayMs = 800 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === retries) break;
      const delay = baseDelayMs * Math.pow(2, i);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
