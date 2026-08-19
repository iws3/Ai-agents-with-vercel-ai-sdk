// The result.toolCalls array contains information about every tool the AI decided to call. Each tool call has the tool name, the arguments the AI generated, and a unique ID. The result.toolResults array contains what each tool execution returned. For multi-step executions, result.steps is an array where each element represents one round of AI processing, including which tools were called in that round and their results.
// This metadata is valuable for debugging, logging, and understanding what your AI agent is doing. You can track which tools are used most frequently, see what parameters the AI is generating, and identify when the AI makes unexpected or incorrect tool calls.

import { generateText, stepCountIs, tool } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import "dotenv/config";

const model = groq("qwen/qwen3-32b");

const getWeather = tool({
  description: "Get the current weather for a given location",
  inputSchema: z.object({
    location: z.string().describe('The city and country, eg. "Paris, France"'),
  }),
  execute: async ({ location }: { location: string }) => {
    // in a real implementation, you would call a weather API here. For this example, we'll return dummy data.
    return {
      location,
      temperature: "20C",
      condition: "Sunny",
    };
  },
});

const mealToEat = tool({
  description: "Get the best meal to eat based on the weather",
  inputSchema: z.object({
    weatherCondition: z
      .string()
      .describe("The current weather condition, eg. 'Sunny', 'Rainy', etc."),
  }),

  execute: async ({ weatherCondition }) => {
    // make api call here

    return {
      meal: "pizza",
      reason: `Because it's ${weatherCondition} outside, pizza is a great comfort food!`,
    };
  },
});

async function askAboutWeather() {
  const result = await generateText({
    model: model,
    tools: {
      getWeather,
      mealToEat,
    },

    stopWhen: stepCountIs(3), // Allow up to 5 steps
    prompt:
      "what is the weather in Douala-Cameroon right now and suggest a meal to eat based on the weather?",
  });
  console.log(result);
  console.log("calling tool...");
  console.log(result.toolCalls);
  console.log("\n📋 FINAL AI RESPONSE:");
  console.log("=".repeat(70));
  console.log(result.text); // The final generated text
  console.log("=".repeat(70));

  // check if any tools were called and log their names and arguments
  if (result.toolCalls && result.toolCalls.length > 0) {
    console.log("\n Tools that were called:");
    result.toolCalls.map((call, index) => {
      console.log(`${index + 1}. ${call.toolName}`);
      console.log("   Arguments:", call.providerMetadata);
    });
  }

  // check tool results

  if (result.toolResults && result.toolResults.length > 0) {
    console.log("\nTool results");
    result.toolResults.map((toolResults, index) => {
      console.log(`${index + 1}. ${toolResults.toolName}`);
      console.log("   Result:", toolResults.output);
    });
  }
// for multipsteps, inspect steps  here:
if(result.steps && result.steps.length >0){
    console.log("\nSteps taken:");;
    result.steps.map((step, index)=>{
        console.log(`${index+1}`)
        if(step.toolCalls) {
            step.toolCalls.map((tc=>{
                console.log(` - Called ${tc.toolName} with ${tc.providerMetadata}`)
            }))
        }
    })
}

}

askAboutWeather().catch(console.error);
