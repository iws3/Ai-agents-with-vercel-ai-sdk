import "dotenv/config";
// TF-IDF -> CLASSICAL EMBEDDING APPROACH

interface TFIDFVectorizer {
    vocabulary:Map<string, number>;
    idf:Map<string, number>;
    documentCount:number;
}


