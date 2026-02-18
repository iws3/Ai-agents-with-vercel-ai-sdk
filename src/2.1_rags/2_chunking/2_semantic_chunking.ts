// ============================================================================
// CHUNKING STRATEGY 2: SEMANTIC (BY HEADERS/SECTIONS)
// ============================================================================

import { sampleAPIDoc } from "./sample_docs.js";

/**
 * This strategy splits text based on structural markers like headers.
 * For markdown documents, we split on # headers.
 * 
 * This respects the document's semantic structure: each section becomes
 * a chunk, preserving the natural topic boundaries.
 * 
 */

interface Chunk {
    text:string;
    startIndex:number;
    endIndex:number;
    chunkNumber:number;
}


function semanticChunking(text:string):Chunk[] {
const chunks:Chunk[]=[];
const lines=text.split("\n");

let currentSection:string[]=[];
let currentStartLine=0;
let chunkNumber=0;
for(let i=0; i<lines.length;i++){
    console.log(`line number: ${i}`);
    const line=lines[i];

    const isHeader=line.trim().startsWith('#');
    if(isHeader && currentSection.length>0) {
        chunks.push({
            text:currentSection.join('\n').trim(),
            startIndex:currentStartLine,
            endIndex:i,
            chunkNumber:chunkNumber++
        });


    }else{
        currentSection.push(line)
    }
}

// DONT FORGET THE LAST SECTION
if(currentSection.length > 0){
    chunks.push({
        text:currentSection.join('\n').trim(),
        startIndex:currentStartLine,
        endIndex:lines.length,
        chunkNumber:chunkNumber++
    })
}



    return chunks
}

function main() {
    const semanticChunks=semanticChunking(sampleAPIDoc);
    console.log(`sample chunks: ${semanticChunks}`)
}

main()