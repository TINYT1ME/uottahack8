require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require('readline'); // 1. Tool to read your typing

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 2. Set up the terminal "listener"
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  // 3. Ask the user for input
  userInterface.question("\nWhat do you want to ask Gemini? (or type 'exit'): ", async (input) => {
    
    if (input.toLowerCase() === 'exit') {
      userInterface.close();
      return;
    }

    try {
      console.log("... Thinking ...");
      const result = await model.generateContent(input);
      console.log("\nGemini:", result.response.text());
    } catch (error) {
      console.error("Error:", error.message);
    }

    // 4. Run the function again to keep the loop going!
    chat();
  });
}

console.log("--- Welcome to your Gemini Terminal! ---");
chat();