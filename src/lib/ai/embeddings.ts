import OpenAI from 'openai';

// ─── Embedding Generation ────────────────────────────────────────────────────

/**
 * Generate a vector embedding for the given text using OpenAI's
 * text-embedding-3-small model. Returns an empty array when no API key
 * is configured so callers can gracefully degrade.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn(
      '[Embeddings] OPENAI_API_KEY not set — returning empty embedding'
    );
    return [];
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.trim().slice(0, 8000), // model limit safety
    });

    return response.data[0]?.embedding ?? [];
  } catch (error) {
    console.error('[Embeddings] Failed to generate embedding:', error);
    return [];
  }
}

// ─── Text Builders ───────────────────────────────────────────────────────────

/**
 * Combine startup fields into a single text suitable for embedding.
 */
export function buildStartupEmbeddingText(startup: {
  name: string;
  tagline?: string | null;
  description?: string | null;
  industry?: string | null;
  stage?: string | null;
}): string {
  const parts: string[] = [
    startup.name,
    startup.tagline ?? '',
    startup.description ?? '',
    startup.industry ? `Industry: ${startup.industry}` : '',
    startup.stage ? `Stage: ${startup.stage}` : '',
  ];

  return parts.filter(Boolean).join('. ').trim();
}

/**
 * Combine talent profile fields into a single text suitable for embedding.
 */
export function buildTalentEmbeddingText(talent: {
  title: string;
  bio?: string | null;
  skills: string[];
  category?: string | null;
}): string {
  const parts: string[] = [
    talent.title,
    talent.bio ?? '',
    talent.skills.length > 0 ? `Skills: ${talent.skills.join(', ')}` : '',
    talent.category ? `Category: ${talent.category}` : '',
  ];

  return parts.filter(Boolean).join('. ').trim();
}

// ─── Similarity Search (pgvector placeholder) ────────────────────────────────

/**
 * Find similar items by comparing embeddings using pgvector's cosine
 * distance operator. This is a placeholder that returns an empty result
 * set — wire it up once pgvector is enabled on your Supabase instance.
 *
 * Expected SQL (for reference):
 *   SELECT *, 1 - (embedding <=> $1::vector) AS similarity
 *   FROM <table>
 *   ORDER BY embedding <=> $1::vector
 *   LIMIT $2;
 */
export async function findSimilar(
  embedding: number[],
  table: string,
  limit: number = 10
): Promise<{ id: string; similarity: number }[]> {
  if (embedding.length === 0) {
    console.warn(
      '[Embeddings] Empty embedding provided — cannot perform similarity search'
    );
    return [];
  }

  // TODO: Replace with actual Supabase RPC call once pgvector is configured.
  //
  // Example implementation:
  //   const supabase = createClient();
  //   const { data, error } = await supabase.rpc('match_' + table, {
  //     query_embedding: embedding,
  //     match_count: limit,
  //   });
  //   if (error) throw error;
  //   return data;

  console.log(
    `[Embeddings] findSimilar called for table "${table}" with limit ${limit} — returning placeholder results`
  );

  return [];
}
