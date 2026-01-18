import { NextRequest, NextResponse } from "next/server";

// Use require for CommonJS module (server-side only)
// Relative path: from app/api/modify-recipe/route.ts to agents/recipe_agent.js
// ../ -> app/api/, ../../ -> app/, ../../../ -> webapp/, then agents/recipe_agent.js
// @ts-ignore - CommonJS require in TypeScript
const { modifyRecipe } = require("../../../agents/recipe_agent.js");

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { recipe, preferences } = body;

        if (!recipe) {
            return NextResponse.json(
                { error: "Recipe is required" },
                { status: 400 }
            );
        }

        if (!preferences || !Array.isArray(preferences)) {
            return NextResponse.json(
                { error: "Preferences array is required" },
                { status: 400 }
            );
        }

        // Join preferences into a single string for the agent
        const preferencesString = preferences.join(", ");

        // Call the modifyRecipe function
        const modifiedRecipe = await modifyRecipe(recipe, preferencesString);

        return NextResponse.json(modifiedRecipe);
    } catch (error: any) {
        console.error("Modify recipe error:", error);
        return NextResponse.json(
            { error: error?.message || "Failed to modify recipe" },
            { status: 500 }
        );
    }
}
