import { yellowcakeExtractStream, withRetries } from "./yellowcakeClient.js";

/**
 * Scrapes a recipe from a URL and returns a Recipe object.
 * 
 * Recipe interface:
 * {
 *   imageUrl?: string;
 *   title: string;
 *   description?: string;
 *   ingredients?: string[];
 *   instructions?: string[];
 *   servings?: number | string;
 *   time?: string;
 *   sourceUrl: string;
 * }
 */

function unwrapYellowcakeData(payload) {
  if (!payload || payload.success !== true) {
    throw new Error(`Yellowcake unsuccessful payload: ${JSON.stringify(payload)?.slice(0, 400)}`);
  }

  const d = payload.data;
  if (Array.isArray(d)) {
    if (d.length === 1 && typeof d[0] === "object") return d[0];
    return d;
  }
  if (typeof d === "object" && d !== null) return d;

  throw new Error(`Unexpected payload.data type: ${typeof d}`);
}

function recipePrompt() {
  return `
  <context>
  You are a scraping agent. You are given a URL to a food recipe website. 
  You are tasked with extracting the recipe details from the page.
  </context>

  <instructions>
  Given this Recipe schema:
  export interface Recipe {
    imageUrl?: string;
    title: string;
    description?: string;
    ingredients?: string[];
    instructions?: string[];
    servings?: number | string;
    time?: string;
    sourceUrl: string;
  }

  Extract the recipe details from the page and return the Recipe object as JSON.
  </instructions>
`;
}

export async function scrapeFoodURL(url, options = {}) {
  const { throttleMode = true, loginURL, authorizedURLs } = options;

  const recipePayload = await withRetries(() =>
    yellowcakeExtractStream({
      url,
      prompt: recipePrompt(),
      throttleMode,
      loginURL,
      authorizedURLs
    }),
    { retries: 2 }
  );

  const recipeData = unwrapYellowcakeData(recipePayload);

  return {
    title: recipeData?.title || "",
    imageUrl: recipeData?.imageUrl || undefined,
    description: recipeData?.description || undefined,
    ingredients: Array.isArray(recipeData?.ingredients) && recipeData.ingredients.length ? recipeData.ingredients : undefined,
    instructions: Array.isArray(recipeData?.instructions) && recipeData.instructions.length ? recipeData.instructions : undefined,
    servings: recipeData?.servings ?? undefined,
    time: recipeData?.time || undefined,
    sourceUrl: recipeData?.sourceUrl || url
  };
}

/** --- CLI runner --- */
async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node scrape-food.js "https://example.com/recipe"');
    process.exit(1);
  }

  try {
    const result = await scrapeFoodURL(url);
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error("Scrape failed:", e?.message || e);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
