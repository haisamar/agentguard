type ReadOptions = {
  fetcher?: typeof fetch;
  wait?: (milliseconds: number) => Promise<void>;
};

// GET only. Never use this retry path for approvals, receipts, or control writes.
export async function readSupabaseJson(url: string, key: string, options: ReadOptions = {}) {
  const fetcher = options.fetcher ?? fetch;
  const wait = options.wait ?? ((milliseconds) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds)));
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetcher(url, {
      method: "GET",
      headers: { apikey: key, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return response.json();
    const error = await response.json().catch(() => null);
    const futureToken = response.status === 401 && error?.code === "PGRST303"
      && error?.message === "JWT issued at future";
    const temporaryServiceFailure = [429, 502, 503, 504].includes(response.status);
    if (attempt < 2 && (futureToken || temporaryServiceFailure)) {
      await wait(attempt === 0 ? 500 : 1500);
      continue;
    }
    // Do not include database response bodies or credentials in logs/errors.
    throw new Error(`Database read failed (${response.status})`);
  }
  throw new Error("Database read is unavailable");
}
