import { generateText, Output } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import "dotenv/config"
const model = google('gemini-2.5-flash');

async function classifySentiment() {

    const sentimentSchema=z.object({
        text:z.string().describe("The analyzed text"),
        sentiment:z.enum(['positive', 'negative', 'neutral']).describe("The overall sentiment of the text"),

        confidence:z.number().min(0).max(1),

        emotions:z.array(
            z.enum(['joy','sadness','anger', 'fear','surprise','disgust']).describe('Specific emotions detected in the text'),
        )
    });

    const result=await generateText({
        model:model,
        output:Output.object({
            schema:sentimentSchema
        }),
        prompt:"Analyze the sentiment of this review: 'The food was absolutely amazing but the service was terrible and we waited an hour for our meal.'"
    });

    console.log('Sentiment:', result.output.sentiment);
    console.log('Confidence:', result.output.confidence);
    console.log("Emotions: ", result.output.emotions.join(', '));
    console.log("DATA RECEIVED: ", result.output)

}


classifySentiment();