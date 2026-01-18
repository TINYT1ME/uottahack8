import { yellowcakeExtractStream, withRetries } from "./yellowcakeClient.js";

/**
 * Output shapes:
 * - Single recipe URL => Recipe
 * - List page URL => { recipes: Recipe[] }
 *
 * Recipe matches your TS interface:
 * {
 *   imageUrl?: string;
 *   title: string;
 *   description?: string;
 *   ingredients?: string[];
 *   instructions?: string[];
 *   servings?: number | string;
 *   time?: string;
 *   sourceUrl?: string;
 * }
 */
console.log("RUNNING:", import.meta.url);
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

function asArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

/** --- Prompts --- */

function classifierPrompt() {
  return `
Classify this webpage.

Return JSON:
{
  "page_type": "recipe_list" | "single_recipe" | "unknown",
  "confidence": number,
  "recipe_urls": string[]
}

Rules:
- If multiple recipe cards/links exist, page_type="recipe_list".
- If a single recipe with ingredients/instructions exists, page_type="single_recipe".
- recipe_urls should be up to 30 absolute URLs (https://...), only if clearly present.
- Do not invent.
`;
}

function recipeListPrompt() {
  return `
Extract recipes from this page (max 30).

Return JSON with:
{
  "recipes": [
    {
      "title": string,
      "sourceUrl": string,
      "imageUrl": string|null,
      "description": string|null
    }
  ]
}

Rules:
- sourceUrl MUST be absolute (https://...).
- Only include real recipe links/cards.
- Do not invent values.
`;
}

function recipeJsonLdPrompt() {
  return `
Find schema.org JSON-LD on the page and extract the object representing a Recipe.

Return ONLY JSON:
{
  "found": boolean,
  "recipe": object|null
}

Rules:
- The recipe may be in an array, in @graph, or nested. Extract the Recipe object.
- If not found, found=false and recipe=null.
- Do not invent values.
`;
}

function singleRecipeSimplePrompt() {
  return `
Extract the recipe details and return ONLY this JSON shape:

{
  "title": string,
  "imageUrl": string|null,
  "description": string|null,
  "ingredients": string[],
  "instructions": string[],
  "servings": string|number|null,
  "time": string|null,
  "sourceUrl": string
}

Rules:
- ingredients: exact ingredient lines as shown (no rewriting).
- instructions: clean step strings, in order.
- If a field isn't present: use null (and [] only if truly missing).
- Do not guess.
`;
}

/** --- JSON-LD Normalization to Recipe interface --- */

function pickImage(img) {
  if (!img) return null;
  if (typeof img === "string") return img;
  if (Array.isArray(img)) return img.find(v => typeof v === "string") || null;
  if (typeof img === "object") return img.url || img.contentUrl || null;
  return null;
}

function isoDurationToPretty(iso) {
  if (typeof iso !== "string") return null;
  // Accept already-human strings too
  if (!iso.startsWith("P")) return iso;

  const m = iso.match(/^P(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)$/i);
  if (!m) return iso;

  const h = m[2] ? Number(m[2]) : 0;
  const min = m[3] ? Number(m[3]) : 0;

  const parts = [];
  if (h) parts.push(`${h} hr${h === 1 ? "" : "s"}`);
  if (min) parts.push(`${min} min${min === 1 ? "" : "s"}`);
  return parts.length ? parts.join(" ") : iso;
}

function normalizeJsonLdToRecipe(jsonld, fallbackUrl) {
  const getStr = (x) => (typeof x === "string" ? x : null);
  const asArr2 = (x) => (Array.isArray(x) ? x : x ? [x] : []);

  const title = getStr(jsonld?.name) || "";
  const description = getStr(jsonld?.description);

  const ingredients = asArr2(jsonld?.recipeIngredient)
    .filter(v => typeof v === "string")
    .map(s => s.trim())
    .filter(Boolean);

  const rawInstr = asArr2(jsonld?.recipeInstructions);
  const instructions = rawInstr
    .flatMap(step => {
      if (typeof step === "string") return [step];
      if (step && typeof step === "object") {
        if (typeof step.text === "string") return [step.text];
        if (Array.isArray(step.itemListElement)) {
          return step.itemListElement
            .map(x => (typeof x === "string" ? x : x?.text))
            .filter(t => typeof t === "string");
        }
      }
      return [];
    })
    .map(s => s.trim())
    .filter(Boolean);

  const servings = jsonld?.recipeYield ?? undefined;

  const time =
    isoDurationToPretty(jsonld?.totalTime) ??
    isoDurationToPretty(jsonld?.cookTime) ??
    isoDurationToPretty(jsonld?.prepTime) ??
    undefined;

  const sourceUrl = getStr(jsonld?.url) || fallbackUrl;
  const imageUrl = pickImage(jsonld?.image) || undefined;

  return {
    title,
    imageUrl,
    description: description || undefined,
    ingredients: ingredients.length ? ingredients : undefined,
    instructions: instructions.length ? instructions : undefined,
    servings,
    time,
    sourceUrl
  };
}

/** --- Main function --- */

export async function scrapeFoodURL(url, options = {}) {
  const { throttleMode = false, loginURL, authorizedURLs } = options;

  // 1) Classify page
  const classifierPayload = await withRetries(() =>
    yellowcakeExtractStream({
      url,
      prompt: classifierPrompt(),
      throttleMode,
      loginURL,
      authorizedURLs
    }),
    { retries: 2 }
  );

  const classifier = unwrapYellowcakeData(classifierPayload);
  const pageType = classifier?.page_type || "unknown";
  const confidence = Number(classifier?.confidence ?? 0);

  // 2) Recipe list page => return { recipes: Recipe[] }
  if (pageType === "recipe_list" && confidence >= 0.35) {
    const listPayload = await withRetries(() =>
      yellowcakeExtractStream({
        url,
        prompt: recipeListPrompt(),
        throttleMode,
        loginURL,
        authorizedURLs
      }),
      { retries: 2 }
    );

    const listData = unwrapYellowcakeData(listPayload);
    const recipes = asArray(listData?.recipes)
      .map(r => ({
        title: r?.title || "",
        imageUrl: r?.imageUrl || undefined,
        description: r?.description || undefined,
        sourceUrl: r?.sourceUrl || undefined
      }))
      .filter(r => r.title && r.sourceUrl)
      .slice(0, 30);

    // If list extraction is weak, add classifier URLs as fallback entries
    const urls = asArray(classifier?.recipe_urls).filter(Boolean);
    const known = new Set(recipes.map(r => r.sourceUrl));
    for (const u of urls) {
      if (recipes.length >= 30) break;
      if (known.has(u)) continue;
      recipes.push({ title: "(recipe)", sourceUrl: u });
      known.add(u);
    }

    return { recipes };
  }

  // 3) Single recipe => JSON-LD first (more reliable), then fallback prompt
  const jsonldPayload = await withRetries(() =>
    yellowcakeExtractStream({
      url,
      prompt: recipeJsonLdPrompt(),
      throttleMode: true, // helps on cookie/consent/JS-heavy sites
      loginURL,
      authorizedURLs
    }),
    { retries: 2 }
  );

  const jsonldData = unwrapYellowcakeData(jsonldPayload);

  if (jsonldData?.found && jsonldData?.recipe) {
    return normalizeJsonLdToRecipe(jsonldData.recipe, url);
  }

  // Fallback: direct extraction
  const recipePayload = await withRetries(() =>
    yellowcakeExtractStream({
      url,
      prompt: singleRecipeSimplePrompt(),
      throttleMode: true,
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
    console.error('Usage: node scrape-food.js "https://example.com/recipe-or-list"');
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
