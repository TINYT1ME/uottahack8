import { yellowcakeExtractStream, withRetries } from "./yellowcakeClient.js";

/* ------------------ helpers ------------------ */

function unwrapYellowcakeData(payload) {
  if (!payload || payload.success !== true) {
    throw new Error(
      `Yellowcake unsuccessful payload: ${JSON.stringify(payload)?.slice(0, 400)}`
    );
  }

  const d = payload.data;
  if (Array.isArray(d)) {
    if (d.length === 1 && typeof d[0] === "object") return d[0];
    return d;
  }
  if (typeof d === "object" && d !== null) return d;

  throw new Error(`Unexpected payload.data type: ${typeof d}`);
}

function cleanIngredientLine(s) {
  if (!s || typeof s !== "string") return null;
  return s
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/^[\d/.\s]+/g, "")
    .replace(/\b(cups?|tablespoons?|teaspoons?|lbs?|ounces?|oz|grams?|kg)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------ Yellowcake prompt ------------------ */

function substitutionPrompt({ ingredients, dietPrompt }) {
  const uniq = Array.from(
    new Set(ingredients.map(cleanIngredientLine).filter(Boolean))
  ).slice(0, 30);

  return `
You are extracting ingredient substitution guidance from a webpage.

Dietary requirement:
${dietPrompt}

Only extract substitutions relevant to THIS ingredient list:
${JSON.stringify(uniq)}

Return ONLY JSON in this exact shape:
{
  "substitutions": [
    {
      "ingredient": string,
      "alternatives": [
        {
          "name": string,
          "notes": string|null,
          "reason": string|null
        }
      ]
    }
  ]
}

Rules:
- Do NOT invent substitutions.
- Only include substitutions clearly stated on the page.
- Ignore ingredients not in the provided ingredient list.
- Prefer concise, useful substitutions.
`;
}

/* ------------------ formatter (STRING OUTPUT) ------------------ */

function formatSubstitutionsToString({
  recipeIngredients,
  dietPrompt,
  substitutions,
  sources
}) {
  if (!substitutions.length) {
    return `No suitable substitutions were found for the provided recipe ingredients under the "${dietPrompt}" diet.`;
  }

  let out = `Dietary substitution guidance\n`;
  out += `Diet: ${dietPrompt}\n\n`;

  out += `Original recipe ingredients:\n`;
  for (const ing of recipeIngredients.slice(0, 15)) {
    out += `- ${ing}\n`;
  }

  out += `\nRecommended substitutions:\n`;

  for (const sub of substitutions) {
    out += `\n${sub.ingredient}:\n`;
    for (const alt of sub.alternatives) {
      out += `  • ${alt.name}`;
      const meta = [alt.reason, alt.notes].filter(Boolean).join("; ");
      if (meta) out += ` — ${meta}`;
      out += `\n`;
    }
  }

  if (sources.length) {
    out += `\nSources consulted:\n`;
    for (const s of sources) {
      out += `- ${s}\n`;
    }
  }

  return out.trim();
}

/* ------------------ core exported function ------------------ */

export async function scrapeIngredientAlternativesFromUrls({
  urls,
  ingredients,
  dietPrompt,
  options = {}
}) {
  if (!Array.isArray(urls) || urls.length === 0) {
    return `No substitution sources were provided for the ${dietPrompt} diet.`;
  }

  const collected = [];
  const sources = [];

  for (const url of urls) {
    const payload = await withRetries(
      () =>
        yellowcakeExtractStream({
          url,
          prompt: substitutionPrompt({ ingredients, dietPrompt }),
          throttleMode: true,
          ...options
        }),
      { retries: 2 }
    );

    const data = unwrapYellowcakeData(payload);

    if (Array.isArray(data?.substitutions)) {
      collected.push(...data.substitutions);
      sources.push(url);
    }
  }

  /* ---- merge + dedupe ---- */

  const map = new Map();

  for (const item of collected) {
    const key = cleanIngredientLine(item.ingredient);
    if (!key) continue;

    if (!map.has(key)) {
      map.set(key, {
        ingredient: item.ingredient,
        alternatives: []
      });
    }

    const entry = map.get(key);

    for (const alt of item.alternatives || []) {
      if (
        alt?.name &&
        !entry.alternatives.some(
          (x) => cleanIngredientLine(x.name) === cleanIngredientLine(alt.name)
        )
      ) {
        entry.alternatives.push({
          name: alt.name,
          notes: alt.notes ?? null,
          reason: alt.reason ?? null
        });
      }
    }
  }

  const merged = Array.from(map.values()).filter(
    (x) => x.alternatives.length > 0
  );

  return formatSubstitutionsToString({
    recipeIngredients: ingredients,
    dietPrompt,
    substitutions: merged,
    sources
  });
}

/* ------------------ CLI test ------------------ */

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error(
      'Usage: node scrape-alternatives.js "https://example.com/keto-substitutions"'
    );
    process.exit(1);
  }

  const exampleIngredients = [
    "2 cups all-purpose flour",
    "1 cup sugar",
    "breadcrumbs",
    "sour cream"
  ];

  const text = await scrapeIngredientAlternativesFromUrls({
    urls: [url],
    ingredients: exampleIngredients,
    dietPrompt: "keto / low-carb (avoid sugar and refined flour)"
  });

  console.log("\n========== RESULT ==========\n");
  console.log(text);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
