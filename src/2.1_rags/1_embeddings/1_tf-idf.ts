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

function buildTFIDFVectorizer(documents:string[]):TFIDFVectorizer {
    const vocabulary=new Map<string, number>();
    const documentFrequency=new Map<string, number>();
    const documentCount=documents.length;


    

    return {

    }

}



