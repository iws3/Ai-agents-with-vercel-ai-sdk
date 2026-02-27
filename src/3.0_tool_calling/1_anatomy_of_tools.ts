// In the Vercel AI SDK, a tool has three essential components: a description that explains what the tool does, an input schema that specifies what parameters the tool requires, and an execute function that actually performs the tool's operation.

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
    execute:async ({location})=>{
        // in a real implementation, you would call a weather API here. For this example, we'll return dummy data.

        return{
            location,
            temperature:"20C",
            condition:"Sunny",
            humidity:"50%"

        }
    }
})


