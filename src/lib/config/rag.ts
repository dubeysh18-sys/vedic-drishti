export const RAG_CONFIG = {
  vectorIndexName: process.env.VECTOR_INDEX_NAME || "scripture_vector_index",
  topK: Number(process.env.TOP_K) || 10,
  rerankK: Number(process.env.RERANK_K) || 5,
  noMatchThreshold: Number(process.env.NO_MATCH_THRESHOLD) || 0.35,

  // Configurable Reranking Weights
  rerankWeights: {
    semantic: Number(process.env.RERANK_WEIGHT_SEMANTIC) || 0.55,
    concept: Number(process.env.RERANK_WEIGHT_CONCEPT) || 0.20,
    emotion: Number(process.env.RERANK_WEIGHT_EMOTION) || 0.15,
    situation: Number(process.env.RERANK_WEIGHT_SITUATION) || 0.10,
  },

  maxInputLength: Number(process.env.MAX_INPUT_LENGTH) || 2000,
  maxContextMessages: Number(process.env.MAX_CONTEXT_MESSAGES) || 5,

  corpusVersion: process.env.CORPUS_VERSION || "gita-v1.0",
  metadataVersion: process.env.METADATA_VERSION || "metadata-v1",
  embeddingVersion: process.env.EMBEDDING_VERSION || "embedding-v1",
  embeddingDimensions: Number(process.env.EMBEDDING_DIMENSIONS) || 768,
};
