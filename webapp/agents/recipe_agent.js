require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA98W2yMj4bt-N8NnbR4axTMAYWJGMobBI");

// force Gemini to return JSON
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

// Generate image for new recipe
// async function generateImage(recipe) {

// }

// library of keywords and common misspellings or alternate spellings that would trigger each one
const keyWords = {
  "vegan": ["vegan", "vegen", "vgan", "plant based", "plant-based"],

  "keto": ["keto", "ketogenic", "kito", "ketto",
    "low carb", "low-carb", "no carb", "no carbs", "zero carb",
    "very low carb", "high fat low carb", "lchf",
    "ketosis", "keto friendly", "keto-friendly",
    "net carbs", "net carb", "gym bro"],

  "high protein": ["high protein", "high-protein", "protein rich", "protein-rich",
    "more protein", "extra protein", "added protein",
    "protein packed", "protein-packed", "protein boost",
    "lean protein", "higher protein",
    "grams of protein", "g protein", ""],

  "gluten-free": ["gluten free", "gluten-free", "gf", "g/f",
    "celiac", "coeliac",
    "wheat free", "wheat-free", "no wheat",
    "no gluten", "gluten friendly", "gluten-friendly",
    "barley free", "rye free"],

  "heart healthy": ["heart healthy", "heart-healthy", "cardio", "cardio friendly",
    "low sodium", "low-sodium", "reduced sodium", "no salt", "less salt",
    "low fat", "low-fat", "reduced fat",
    "low cholesterol", "cholesterol friendly",
    "good fats", "healthy fats", "omega 3", "omega-3",
    "mediterranean", "dash diet", "dash"],

  "low sugar": ["low sugar", "low-sugar", "less sugar", "reduced sugar",
    "no sugar", "sugar free", "sugar-free", "zero sugar", "0 sugar",
    "unsweetened", "un-sweetened",
    "diabetic", "diabetes friendly", "diabetic friendly",
    "low glycemic", "low-gi", "glycemic",
    "no added sugar", "without added sugar"],

  "anti-inflammatory": ["anti inflammatory", "anti-inflammatory",
    "anti inflammation", "anti-inflammation",
    "reduce inflammation", "reduces inflammation",
    "inflammation", "inflammatory",
    "arthritis friendly", "joint pain"],

  "dairy-free": ["dairy free", "dairy-free", "no dairy", "milk free", "milk-free",
    "lactose free", "lactose-free", "lactose intolerant", "non dairy", "non-dairy",
    "casein free", "whey free", "milk allergy"],

  "nut-free": ["nut free", "nut-free", "no nuts", "peanut free", "peanut-free",
    "tree nut free", "tree-nut free", "nut allergy", "no peanuts", "school safe"],

  "halal": ["halal", "muslim", "islam", "islamic", "haram",
    "no pork", "pork free", "no alcohol", "alcohol free", "alcohol-free", "zabiha"],

  "kosher": ["kosher", "parve", "kashrut", "jewish", "pareve", "no shellfish"],

  "high-fibre": ["high fibre", "high fiber", "high-fiber", "fiber rich", "fibre rich",
    "more fiber", "more fibre", "fiber", "fibre", "roughage", "digestion", "good source of fiber"],

  "healthy": ["healthy", "healthier", "clean eating", "clean eat", "wholesome",
    "balanced", "nutritious", "better for me", "good for me"],

  "low calorie": ["low calorie", "low-calorie", "low cal", "caloric deficit",
    "weight loss", "slimming", "light", "diet", "cutting", "watch my weight"],

  "budget": ["budget", "cheap", "affordable", "student", "low cost",
    "save money", "inexpensive", "frugal", "economical"],
};


// knowledge base for rules and substitutions of each category
const substituteGuides = {
  "vegan": `
    SOURCE: Vegan Society & PETA Kitchen
    STRICT RULE: REMOVE all animal products (meat, dairy, eggs, honey, gelatin).
    
    1. EGGS (Baking) -> 1 tbsp ground flaxseed + 3 tbsp water OR 1/4 cup applesauce.
    2. EGGS (Scrambling) -> Firm Tofu (crumbled) with turmeric for color.
    3. EGGS (Whites/Meringue) -> Aquafaba (liquid from a can of chickpeas).
    4. MILK -> Oat milk (creamy/coffee), Soy milk (baking), or Almond milk.
    5. BUTTER -> Vegan butter sticks (Earth Balance/Miyoko's) or Coconut Oil.
    6. CHEESE (Parmesan) -> Nutritional Yeast mixed with ground cashews.
    7. CHEESE (Melting) -> Cashew cheese sauce or commercial vegan shreds.
    8. HONEY -> Maple syrup, Agave nectar, or Date paste.
    9. MEAT (Ground) -> Lentils, Walnuts/Mushrooms blend, or TVP (Textured Vegetable Protein).
    10. GELATIN -> Agar Agar powder.
    11. WORCESTERSHIRE SAUCE -> Soy sauce + Apple cider vinegar (regular has anchovies).
  `,

  "keto": `
    SOURCE: Diet Doctor & Healthline
    STRICT RULE: High fat, very low carbs (<20g net), moderate protein. NO sugar, grains, or tubers.
    
    1. FLOUR (Baking) -> Super-fine Almond Flour or Coconut Flour (use 1/4 amount of coconut).
    2. THICKENER (Cornstarch) -> Xanthan Gum (tiny amount) or Glucomannan.
    3. SUGAR -> Erythritol (Swerve), Stevia, or Monk Fruit. NO Honey/Maple.
    4. MILK -> Heavy Whipping Cream or Unsweetened Almond Milk.
    5. PASTA -> Zucchini noodles (Zoodles), Shirataki (Konjac) noodles, or Spaghetti Squash.
    6. RICE -> Riced Cauliflower (fry dry to remove moisture).
    7. POTATOES -> Mashed Cauliflower with cream cheese or Radishes (roasted).
    8. BREADING (for frying) -> Crushed Pork Rinds or Parmesan Cheese.
    9. FRUIT -> Berries only (Raspberry/Blackberry). NO Bananas/Apples.
    10. LEGUMES -> Avoid beans/lentils (too high carb). Use Black Soy Beans if needed.
  `,

  "high protein": `
    SOURCE: Bodybuilding.com & Men's Health
    GOAL: Maximize protein per calorie. Reduce empty fats.
    
    1. FLOUR -> Replace 1/3 cup flour with Whey/Casein/Pea protein powder (unflavored).
    2. SOUR CREAM -> Greek Yogurt (0% fat). This is a 1:1 swap.
    3. PASTA -> Chickpea Pasta (Banza) or Red Lentil Pasta.
    4. RICE -> Quinoa (complete protein) or mix rice with Hemp Hearts.
    5. CREAM CHEESE -> Cottage Cheese (blended smooth).
    6. PEANUT BUTTER -> PB2 (Powdered Peanut Butter) to cut fat.
    7. BREAKFAST -> Add egg whites to oatmeal.
    8. SNACKS -> Edamame, Jerky, or Roasted Chickpeas.
    9. SAUCES -> Blend Silken Tofu into sauces for creaminess + protein.
  `,

  "gluten-free": `
    SOURCE: Celiac Disease Foundation
    STRICT RULE: NO wheat, barley, rye, triticale, malt. Watch for hidden gluten.
    
    1. WHEAT FLOUR -> "Measure-for-Measure" GF Blend (Bob's Red Mill/King Arthur).
    2. SOY SAUCE -> Tamari (Japanese GF soy sauce) or Coconut Aminos.
    3. BEER (in cooking) -> Gluten-Free Beer, Cider, or Chicken Broth.
    4. COUSCOUS -> Quinoa or Millet.
    5. OATS -> Must be certified "Gluten-Free Oats" (regular oats have cross-contamination).
    6. BREADCRUMBS -> Crushed GF Pretzels, Corn Chex, or GF Panko.
    7. MALT VINEGAR -> Apple Cider Vinegar.
    8. THICKENER -> Cornstarch, Tapioca Starch, or Arrowroot powder.
  `,

  "heart healthy": `
    SOURCE: American Heart Association
    GOAL: Low sodium (<1500mg), low saturated fat, high fiber.
    
    1. SALT -> Lemon juice, vinegar, garlic/onion powder, smoked paprika.
    2. OIL/BUTTER -> Extra Virgin Olive Oil or Avocado Oil. Avoid Coconut/Palm oil.
    3. BAKING FATS -> Applesauce or Mashed Bananas.
    4. DAIRY -> Skim milk, low-fat yogurt. Avoid heavy cream.
    5. MEAT -> Skinless Chicken Breast, Turkey, White Fish, or Tofu.
    6. RED MEAT -> If using, choose "Loin" or "Round" cuts (trim visible fat).
    7. GRAINS -> Barley, Quinoa, Oats, Brown Rice (soluble fiber lowers cholesterol).
    8. CANNED BEANS -> Rinse thoroughly to remove 40% of sodium.
    9. EGGS -> Use Egg Whites or Egg Beaters.
  `,

  "low sugar": `
    SOURCE: American Diabetes Association
    GOAL: Low Glycemic Index (GI), no refined sugar.
    
    1. WHITE SUGAR -> Allulose (browning), Erythritol, or Stevia.
    2. SYRUP -> Sugar-Free Maple Syrup or mashed berries.
    3. KETCHUP -> Sugar-free ketchup or Tomato Paste + Vinegar + Spices.
    4. BBQ SAUCE -> Mustard-based sauces or Vinegar-based hot sauce.
    5. CHOCOLATE -> Cacao Nibs or >85% Dark Chocolate.
    6. DRIED FRUIT -> Fresh Berries or Green Apple slices (lower sugar).
    7. YOGURT -> Plain yogurt + add your own fruit (flavored yogurt has high sugar).
    8. SODA/JUICE -> Sparkling water with lemon/lime slice.
  `,

  "anti-inflammatory": `
    SOURCE: Harvard Health & Arthritis Foundation
    GOAL: Reduce inflammation. High Omega-3s, antioxidants.
    
    1. OILS -> Extra Virgin Olive Oil, Flaxseed Oil, Walnut Oil. NO Vegetable/Corn/Soybean oil.
    2. SUGAR -> Maple Syrup or Honey (in very small amounts). Avoid corn syrup.
    3. REFINED GRAINS -> Whole grains, Black Rice, Quinoa.
    4. MEAT -> Fatty Fish (Salmon, Mackerel, Sardines) for Omega-3s.
    5. NUTS -> Walnuts and Almonds.
    6. SPICES -> Add Turmeric + Black Pepper (activates anti-inflammatory properties).
    7. GINGER -> Add fresh ginger to stir-fries or tea.
    8. VEGETABLES -> Dark leafy greens (Spinach/Kale) and Cruciferous (Broccoli).
  `,

  "dairy-free": `
    SOURCE: Go Dairy Free & Mayo Clinic
    STRICT RULE: REMOVE Milk, Cream, Butter, Cheese, Yogurt, Whey, Casein.
    (Note: Eggs and Mayo are SAFE - they are not dairy).
    
    1. MILK (Drinking/Cereal) -> Oat Milk (closest texture) or Almond Milk.
    2. MILK (Baking) -> Soy Milk (high protein helps structure).
    3. BUTTER (Flavor) -> Vegan Butter (Miyoko's/Earth Balance) or Ghee (if only lactose intolerant).
    4. BUTTER (Baking) -> Coconut Oil or Canola Oil.
    5. HEAVY CREAM -> Full-fat Coconut Milk (chill can upside down) or Cashew Cream.
    6. CHEESE (Flavor) -> Nutritional Yeast (nutty/cheesy flavor).
    7. CHEESE (Texture) -> Vegan shreds (Violife/Daiya) - melt at lower temps.
    8. BUTTERMILK -> 1 cup Soy Milk + 1 tbsp Lemon Juice (let sit 5 mins).
    9. YOGURT -> Coconut Yogurt or Almond Milk Yogurt.
    10. WHEY PROTEIN -> Pea Protein or Egg White Protein.
  `,
  "nut-free": `
    SOURCE: FARE (Food Allergy Research & Education)
    STRICT RULE: NO Peanuts or Tree Nuts (Almonds, Cashews, Walnuts, Pecans).
    
    1. ALMOND FLOUR -> Sunflower Seed Flour (1:1 ratio) or Oat Flour.
    2. PEANUT BUTTER -> Sunflower Seed Butter (SunButter) or Soy Butter (WowButter).
    3. WALNUTS/PECANS (in baking) -> Pumpkin Seeds (Pepitas) or Sunflower Seeds.
    4. ALMOND MILK -> Oat Milk or Rice Milk.
    5. CASHEW CREAM -> Coconut Cream or Silken Tofu blended.
    6. PESTO (Pine nuts) -> Pumpkin seed pesto or Basil-oil blend.
    7. NUT OILS (Walnut/Peanut) -> Olive Oil or Canola Oil.
  `,

  "halal": `
    SOURCE: Halal Food Authority
    STRICT RULE: NO Pork, NO Alcohol, NO Gelatin (unless plant-based).
    Meat must be Halal certified (assumed for this recipe).
    
    1. PORK / BACON -> Beef Bacon, Turkey Bacon, or Smoked Paprika (for flavor).
    2. SAUSAGE -> Beef or Lamb Sausage.
    3. WINE (Cooking) -> 100% Grape Juice + splash of Vinegar (for acidity).
    4. BEER (Cooking) -> Beef broth or Ginger Ale.
    5. VANILLA EXTRACT (Alcohol-based) -> Vanilla Bean Powder or Artificial Vanilla.
    6. GELATIN -> Agar Agar or Pectin.
    7. LARD -> Vegetable Shortening or Oil.
  `,

  "kosher": `
    SOURCE: OU Kosher
    STRICT RULE: NO Pork, NO Shellfish.
    CRITICAL RULE: DO NOT MIX MEAT AND DAIRY. 
    (If recipe has Meat + Cheese/Milk -> Swap the Dairy for Non-Dairy substitute).
    
    1. PORK -> Beef, Lamb, or Turkey.
    2. SHELLFISH (Shrimp/Crab) -> Firm White Fish (Cod/Halibut) or Surimi (Imitation Crab).
    3. BUTTER (in Meat meal) -> Margarine or Oil.
    4. CHEESE (in Meat meal) -> Omit or use Vegan Cheese.
    5. MILK (in Meat meal) -> Oat Milk or Water.
    6. GELATIN -> Fish Gelatin or Agar Agar.
  `,

  "high-fibre": `
    SOURCE: Mayo Clinic
    GOAL: Increase dietary fiber. Target: Whole grains, legumes, vegetables.
    
    1. WHITE RICE -> Brown Rice, Wild Rice, or Barley.
    2. WHITE PASTA -> Whole Wheat Pasta or Lentil Pasta.
    3. WHITE BREAD -> 100% Whole Grain Bread.
    4. FLOUR (All-Purpose) -> 50/50 mix of Whole Wheat Flour and White Flour.
    5. MEAT (Ground) -> Mix in 50% Lentils or Black Beans to add bulk/fiber.
    6. JUICE -> Whole Fruit (with skin).
    7. SNACKS -> Air-popped Popcorn or Nuts/Seeds.
    8. POTATOES -> Leave skins on (Sweet Potato > White Potato).
    9. THICKENERS -> Add Ground Flaxseed or Chia Seeds.
  `,
  "healthy": `
    SOURCE: USDA MyPlate & Harvard Health
    GOAL: Balanced nutrition. More whole foods, less processed junk.
    
    1. REFINED GRAINS (White Rice/Pasta) -> Whole grains (Quinoa, Brown Rice, Farro).
    2. FRYING -> Baking, Roasting, or Air-Frying.
    3. CREAMY SAUCES -> Tomato-based sauces or Olive Oil based sauces.
    4. SUGAR -> Honey or Maple Syrup (natural sources) in moderation.
    5. FATTY MEAT -> Lean Chicken, Turkey, or Fish.
    6. VEGETABLES -> Double the amount of vegetables in any recipe.
    7. SALT -> Reduce by 50% and use fresh herbs/lemon instead.
    8. SNACKS -> Fruit/Nuts instead of Chips/Cookies.
  `,
  "low calorie": `
    SOURCE: Weight Watchers (inspired) & Healthline
    GOAL: High volume, low energy density. Cut fat and sugar.
    
    1. OIL/BUTTER -> Spray oil (minimize usage) or Broth for sautéing.
    2. SUGAR -> Stevia or Erythritol (0 calorie).
    3. PASTA/RICE -> Zucchini Noodles or Konjac Noodles (near 0 cal).
    4. CREAM -> Unsweetened Almond Milk (30 cal/cup) or Skim Milk.
    5. CHEESE -> Reduced-fat cheese or Nutritional Yeast.
    6. MEAT -> Ultra-lean Turkey or Chicken Breast.
    7. BULKING -> Add Zucchini or Spinach to "stretch" the meal without calories.
    8. MAYO -> Greek Yogurt mixed with mustard.
  `,
  "budget": `
    SOURCE: Budget Bytes
    GOAL: Lowest cost per serving. Swap premium ingredients for pantry staples.
    
    1. STEAK/BEEF -> Ground Beef, Lentils, or Beans (canned).
    2. FRESH FISH -> Canned Tuna or Frozen Fish Fillets.
    3. FRESH BERRIES -> Frozen Berries or Apples/Bananas.
    4. PINE NUTS/WALNUTS -> Sunflower Seeds or Peanuts.
    5. QUINOA -> Brown Rice or Oats.
    6. FANCY CHEESE (Gruyere/Goat) -> Cheddar or Mozzarella.
    7. WINE (for cooking) -> Vinegar + Grape Juice or Broth.
    8. SAFFRON -> Turmeric (for color).
    9. VANILLA BEAN -> Artificial Vanilla Extract.
    10. AVOCADO OIL -> Canola or Vegetable Oil.
  `
};



// function that takes in a recipe object and user preference string, returns modified recipe object
async function modifyRecipe(scrapedRecipe, userPreference) {

  console.log(`\n🤖 Working on: "${scrapedRecipe.name}" for prefs: "${userPreference}"...`);

  // if no preference is sent send back the original recipe
  if (!userPreference) return scrapedRecipe;

  let cheatSheet = "";

  for (const [categoryName, guideText] of Object.entries(substituteGuides)) {
    // if we don't have a keyword list for a category, use the name itself
    const searchTerms = keyWords[categoryName] || [categoryName];

    // check match
    const isMatch = searchTerms.some(term => userPreference.toLowerCase().includes(term));
    if (isMatch) {
      cheatSheet += guideText + "\n";
    }
  }

  // prompt that gives Gemini the task
  const prompt = `
      You are an expert Culinary Nutritionist and Food Scientist.
      Your task is to adapt the Input Recipe to strictly match the User Preference.
      The new recipe still has to make sense, and be somehwat similar to the original.
      The whole point is the user wants the original recipe, but modified to fit their dietary needs or lifestyle.
      
      --- KNOWLEDGE BASE (STRICT RULES) ---
      ${cheatSheet}

      -------------------------------------
      
      CRITICAL LOGIC GATES:
      1. HIERARCHY: Medical restrictions (Allergies/Celiac) ALWAYS override Lifestyle choices (Keto/Paleo).
      2. CULINARY PHYSICS: If you change an ingredient, you MUST update the cooking instructions. 
         (Example: If swapping 'Rice' (20 mins boil) for 'Cauliflower Rice' (5 mins fry), you must rewrite the instruction).
      3. FLAVOR PRESERVATION: If you remove Fat or Salt, you MUST add herbs, spices, or acid (lemon/vinegar) to maintain flavor.
      4. INTEGRITY: Do not change ingredients that don't need changing. Keep the original portions unless the chemistry requires a change.

      RETURN JSON ONLY with this specific schema:
      {
        "recipe_name": "A creative new name (e.g. 'Keto-Friendly Carbonara')",
        "ingredients": ["List of strings"],
        "time": "New cooking time estimate (e.g. '15 mins')",
        "instructions": ["List of strings"],
        "macros_estimated": "High Protein / Low Carb / etc",
        "change_log": [
           { "original": "Pasta", "new": "Zucchini Noodles", "reason": "Swapped for Keto compliance (low carb)" },
           { "original": "Boil 10 mins", "new": "Sauté 3 mins", "reason": "Zucchini noodles cook much faster than wheat pasta" }
        ]
      }
      
      Input Recipe: ${JSON.stringify(scrapedRecipe)}
      User Preference: "${userPreference}"
    `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // clean up markdown if Gemini adds it (for ex: json code block)
    const jsonString = text.replace(/```json|```/g, "").trim();
    const newRecipe = JSON.parse(jsonString);

    return newRecipe;

  } catch (error) {
    console.error("AI Error:", error.message);
    // if it fails, fail safe by returning the original
    return scrapedRecipe;
  }
}

// exports the function so other files can use it
module.exports = { modifyRecipe };
