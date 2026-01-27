const REQUEST_DELAY_MS = 20; // Optimized: 5x faster while staying within GitHub rate limits
const MAX_RETRIES = 5;
const INITIAL_RETRY_DELAY_MS = 1000;
const MAX_RETRY_DELAY_MS = 30000;
const BATCH_SIZE = 50;

let lastRequestTime = 0;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJitter(): number {
  return Math.random() * 200;
}

export async function rateLimitedFetch(
  url: string,
  options: RequestInit,
  retryCount = 0
): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < REQUEST_DELAY_MS) {
    await sleep(REQUEST_DELAY_MS - timeSinceLastRequest + getJitter());
  }
  
  lastRequestTime = Date.now();
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(30000),
    });
    
    if (response.status === 403 || response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      const waitTime = retryAfter 
        ? parseInt(retryAfter, 10) * 1000 
        : Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);
        await sleep(waitTime + getJitter());
        return rateLimitedFetch(url, options, retryCount + 1);
      }
    }
    
    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      const waitTime = Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);
      console.log(`Server error ${response.status}, waiting ${waitTime}ms before retry ${retryCount + 1}/${MAX_RETRIES}`);
      await sleep(waitTime + getJitter());
      return rateLimitedFetch(url, options, retryCount + 1);
    }
    
    return response;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isSocketError = errorMessage.includes('UND_ERR_SOCKET') || 
                          errorMessage.includes('socket') ||
                          errorMessage.includes('ECONNRESET') ||
                          errorMessage.includes('ETIMEDOUT') ||
                          errorMessage.includes('fetch failed');
    
    if (isSocketError && retryCount < MAX_RETRIES) {
      const waitTime = Math.min(INITIAL_RETRY_DELAY_MS * Math.pow(2, retryCount), MAX_RETRY_DELAY_MS);
      console.log(`Socket error, waiting ${waitTime}ms before retry ${retryCount + 1}/${MAX_RETRIES}: ${errorMessage}`);
      await sleep(waitTime + getJitter());
      return rateLimitedFetch(url, options, retryCount + 1);
    }
    
    throw error;
  }
}

export async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R | null>,
  onProgress?: (completed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  let completed = 0;
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    
    for (const item of batch) {
      try {
        const result = await processor(item);
        if (result !== null) {
          results.push(result);
        }
      } catch (error) {
        console.error(`Batch item processing error:`, error);
      }
      completed++;
    }
    
    if (onProgress) {
      onProgress(completed, items.length);
    }
    
    if (i + BATCH_SIZE < items.length) {
      await sleep(500 + getJitter());
    }
  }
  
  return results;
}

export { BATCH_SIZE };
