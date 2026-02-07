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
  doc:string;
  vectorizer:TFIDFVectorizer
):number[] {
  const tokens=tokenize(doc);
  const vocabularySize=vectorizer.vocabulary.size;

  // initialize vector with zeros (one 
  const vector=new Array(vocabularySize).fill(0)

}