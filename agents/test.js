const agent = require('./recipe_agent');

const mockRecipe = {
  name: "Test Burger",
  ingredients: ["Bun", "Beef Patty", "Cheese"],
  instructions: ["Grill patty", "Assemble"]
};

async function runTest() {
  console.log("Testing...");
  const result = await agent.modifyRecipe(mockRecipe, "high-protein");
  console.log("Result:", result);
}

runTest();