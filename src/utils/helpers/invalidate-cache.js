export default async (client, patterns) => {
  // Convert single pattern to array for consistent handling
  const patternArray = Array.isArray(patterns) ? patterns : [patterns];

  // Collect all keys from all patterns
  const allKeys = new Set();

  // Scan for each pattern
  await Promise.all(
    patternArray.map(async (pattern) => {
      try {
        let cursor = 0; // Start with numeric 0
        do {
          // Different Redis clients might return results in different formats
          // We need to handle both array responses and object responses
          const result = await client.scan(cursor, {
            MATCH: pattern,
            COUNT: 100,
          });

          // Handle different response formats
          // Some clients return [cursor, keys], others return { cursor, keys }
          const nextCursor = Array.isArray(result) ? result[0] : result.cursor;
          const keys = Array.isArray(result) ? result[1] : result.keys;

          cursor =
            typeof nextCursor === 'string'
              ? parseInt(nextCursor, 10)
              : nextCursor;

          // Add found keys to our Set
          if (Array.isArray(keys)) {
            keys.forEach((key) => allKeys.add(key));
          }
        } while (cursor !== 0);
      } catch (error) {
        console.error(`Error scanning pattern ${pattern}:`, error);
        throw error;
      }
    })
  );

  // If we found any keys, delete them all at once
  if (allKeys.size > 0) {
    const keysArray = Array.from(allKeys);
    try {
      return await client.del(keysArray);
    } catch (error) {
      console.error('Error deleting keys:', error);
      throw error;
    }
  }

  return 0;
};
