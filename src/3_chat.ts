import { generateText } from "ai";
import 'dotenv/config'
import {google} from "@ai-sdk/google"
const model=google('gemini-2.5-flash')
async function chatConversations(): Promise<void> {
    console.log('\n' + '='.repeat(70));
    console.log('PART 3: mULTI-TURN conversation');
    console.log('='.repeat(70));


    try{
        const messages =[
            {
                role:'user' as const,
                content:'What is Vercel SDK?',
            },
            {
                role:'assistant' as const,
                content:'The vercel Ai sdk is a typescript toolkit that provides unified api for working with LLMS'

            },
            {
                role:'user' as const,
                content:'Can you show the typescript code example for it?'
            },
            
        ]

        console.log(`\n - Conversation History`);
        messages.forEach((msg, index)=>{
            console.log(`\n ${index + 1}. ${msg.role.toUpperCase()}: ${msg.content}`);

        })
        // pass the message array to the generated text- Ai use the full generated context to generate relevant answer

        const response=await generateText({
            model:model,
            messages:messages

        })

        console.log(`\n ${messages.length + 1}. ASSISTANT: ${response.text}`)

    }

    catch(err){
        if(err instanceof Error) {
            console.log(`error that occured is: ${err.message}`)

        }
        else{
            console.error("Unknown error")

        }
    }
}

await chatConversations()