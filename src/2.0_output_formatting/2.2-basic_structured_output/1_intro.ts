import 'dotenv/config'
import {generateText, Output} from 'ai';
import {google} from "@ai-sdk/google";
import {z} from 'zod';

const model=google('gemini-2.5-flash');
async function extractPersonInfo() {
    const personSchema=z.object({
        name:z.string().describe('The person\'s full name'),
        age:z.number().describe('The person\'s age in years'),
        occupation:z.string().describe('The person\'s job or profession'),
    })

    const result=await generateText({
        model:model,
        output:Output.object({
            schema:personSchema
        }),
        prompt:'Alice is a 32-year-old esoftware engineer who solves hiking'
    })

    // result.output contains the extracted data
    console.log("Name:", result.output.name);
    console.log("Age", result.output.age);
    console.log("Occupation:", result.output.occupation)
}

extractPersonInfo()