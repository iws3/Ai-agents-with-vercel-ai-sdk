// In the Vercel AI SDK, a tool has three essential components: a description that explains what the tool does, an input schema that specifies what inputSchema the tool requires, and an execute function that actually performs the tool's operation.

import { generateText, tool } from "ai";
import {google} from "@ai-sdk/google";
import {z} from "zod"
import { hu } from "zod/v4/locales";
const model=google("gemini-2.5-flash");


const weatherTool=tool({
    description:"Get the current weather for a given location",
    inputSchema:z.object({
    location:z.string().describe('The city and country, eg. "Paris, France"')
    }),
    execute:async ({location}: {location: string})=>{
        // in a real implementation, you would call a weather API here. For this example, we'll return dummy data.

        return{
            location,
            temperature:"20C",
            condition:"Sunny",
            humidity:"50%"

        }
    }
})

// HOW TOOL WITH GENERATE TEXT:
// When you provide tools to generateText, something interesting happens during execution. The AI processes your prompt and decides it needs weather information. It doesn't just generate text saying "I don't know". Instead, it generates a tool call specifying which tool to use and what inputSchema to pass. The SDK sees this tool call, finds your execute function, runs it with the provided inputSchema, and sends the result back to the AI. The AI then generates its final response incorporating the real weather data.

async function askAboutWeather(){
    const result=await generateText({
        model:model,
        tools: {
            getWeather:weatherTool
        },
        prompt: 'what is the weather in Douala-Cameroon right now?'
    })
}
