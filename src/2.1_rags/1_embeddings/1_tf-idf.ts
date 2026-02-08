import "dotenv/config";
// TF-IDF -> CLASSICAL EMBEDDING APPROACH

interface TFIDFVectorizer {
  vocabulary: Map<string, number>;
  idf: Map<string, number>;
  documentCount: number;
}

// first function: Tokenize text into individual words
// lowercase and split on whitespace

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
  //  filter renoves emty strings
}

// build a tf-idf vectorizer from a collection of documents
// this is the training phase where we learn the vocabulary and IDF VALUES

function buildTFIDFVectorizer(documents: string[]): TFIDFVectorizer {
  const vocabulary = new Map<string, number>();
  const documentFrequency = new Map<string, number>();
  const documentCount = documents.length;

  // FIRST PASS : BUILD A VOCABULARY AND COUNT THE DOCUMENT FREQUENCIES

  documents.forEach((doc) => {
    const tokens = tokenize(doc);
    // count each unique words->each words count omnce per document
    const uniqueWords = new Set(tokens);
    // ->["i", "am", "boy"]
    uniqueWords.forEach((word) => {
      // assign an index to each new word we encounter
      if (!vocabulary.has(word)) {
        vocabulary.set(word, vocabulary.size);
      }

      // count how many documents contain this word
      documentFrequency.set(word, (documentFrequency.get(word) || 0) + 1);
    });
  });

  // SECOND PASS: Calculate IDF for each words

  const idf = new Map<string, number>();
  vocabulary.forEach((_, word) => {
    const df = documentFrequency.get(word) || 1;
    // IDF FORMULA: log(total docs/docs containing word)
    // add 1 to avoid divsion by zero and smooth the values
    idf.set(word, Math.log((documentCount + 1) / (df + 1)) + 1);
  });

  return {
    vocabulary,
    idf,
    documentCount,
  };
}


// CONVERT A SINGLE DOCUMENT INTO A TF-IDF VECTOR
// the vector will have one dimention for each word in the vocabulary

function documentToTFIDFVector(
  doc:string,
  vectorizer:TFIDFVectorizer
):number[] {
  const tokens=tokenize(doc);
  const vocabularySize=vectorizer.vocabulary.size;

  // initialize vector with zeros (one dimensional per vector)
  const vector=new Array(vocabularySize).fill(0);
  // COUNT TERM FREQ IN THE DOCUMENT

  const termFrequency=new Map<string, number>();
  tokens.forEach(word=>{
    termFrequency.set(word, (termFrequency.get(word) || 0) + 1);
  })

  // calculate TF-IDF for each word in the document
  termFrequency.forEach((count, word)=>{
    if(vectorizer.vocabulary.has(word)) {
      const wordIndex=vectorizer.vocabulary.get(word)!;
      const tf=count/tokens.length;
      const idf=vectorizer.idf.get(word) || 0;
      vector[wordIndex]=tf*idf;
    }
  })


  return vector
}

// function cosine similarity:


/**
 * Cosine similarity: The core similarity metric for embeddings.
 * 
 * Math explanation:
 * Given two vectors A and B, cosine similarity is:
 * cos(θ) = (A · B) / (|A| × |B|)
 * 
 * Where:
 * - A · B is the dot product: sum of (A[i] × B[i]) for all i
 * - |A| is the magnitude: sqrt(sum of A[i]² for all i)
 * 
 * Result ranges from -1 to 1:
 * - 1 means vectors point in exactly the same direction (identical meaning)
 * - 0 means vectors are perpendicular (unrelated meaning)
 * - -1 means vectors point in opposite directions (opposite meaning)
 */

function cosineSimilarity(vectorA:number[], vectorB:number[]):number {

  if(vectorA.length!==vectorB.length) {
    throw new Error('Vector must have the same length')
  }

  // calculate the dot product : A.B
  let dotProduct=0;
  for(let i=0;i<vectorA.length;i++){
    dotProduct+=vectorA[i]*vectorB[i];
  }

  // calculate the magnitude of A: |A|

  let magnitudeA=0;
  for(let i=0; i<vectorA.length; i++){
    magnitudeA=vectorA[i] * vectorA[i]
  }
  magnitudeA=Math.sqrt(magnitudeA);

  // calaculate the magnitude of B: |B|
  let magnitudeB = 0;
  for (let i = 0; i < vectorB.length; i++) {
    magnitudeB += vectorB[i] * vectorB[i];
  }
  magnitudeB = Math.sqrt(magnitudeB);
  

// Avoid division by zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // Final cosine similarity
  return dotProduct / (magnitudeA * magnitudeB);
}


/**
 * Euclidean distance: Another way to measure similarity.
 * Unlike cosine similarity, this measures the straight-line distance
 * between two points in the vector space.
 * 
 * Math:
 * distance = sqrt(sum of (A[i] - B[i])² for all i)
 * 
 * Lower values mean more similar (closer together in space).
 */

function euclideanDistance(vectorA:number[], vectorB:number[]):number{
  if(vectorA.length!==vectorB.length){
    throw new Error('Vectors must have the same length');
  }

  let sumSquareDifference=0;
  for(let i=0;i<vectorA.length;i++){
    const difference=vectorA[i]-vectorB[i];
    sumSquareDifference+=difference*difference;
  }

  return Math.sqrt(sumSquareDifference)
}


// NOW EXPERIMENTS WITH TF-IDF
function experimentWithTFIDF(){
  console.log('\n' + '='.repeat(70));

}
