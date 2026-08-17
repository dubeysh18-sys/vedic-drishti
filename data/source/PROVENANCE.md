# Bhagavad Gita Corpus Source Provenance

## Corpus Summary
- **Source Corpus**: Bhagavad Gita (18 Chapters, 701 Verses)
- **File**: `data/source/gita.json`
- **Content Version**: `gita-v1.0`
- **Status**: Canonical Immutable Source Dataset
- **License**: Public Domain / CC0
- **Provenance Status**: `known`

## Structure
Each verse record strictly adheres to the 4-layer trust model:
1. **Original Text**: Sanskrit in Devanagari script.
2. **Transliteration & Word Meanings**: Standard IAST transliteration and word-for-word Sanskrit breakdown.
3. **Translation**: Concordance of classical translations (Swami Sivananda and ancient commentaries).
4. **Retrieval Metadata**: AI-generated philosophical concepts, emotional themes, and life situation mapping with confidence scores.

## Immutability Rule
The files in `data/source/` are immutable snapshots. Any enrichment or vectorization occurs in derived storage and must never overwrite raw source records.
