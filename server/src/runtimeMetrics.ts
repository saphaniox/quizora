let requestCount = 0;
let errorCount = 0;
let totalLatencyMs = 0;

export function startRequestTimer(): bigint {
  return process.hrtime.bigint();
}

export function recordRequest(startedAt: bigint, statusCode: number): void {
  requestCount += 1;
  if (statusCode >= 500) errorCount += 1;
  totalLatencyMs += Number(process.hrtime.bigint() - startedAt) / 1_000_000;
}

export function getRuntimeMetrics(): {
  requestCount: number;
  errorCount: number;
  averageLatencyMs: number;
} {
  return {
    requestCount,
    errorCount,
    averageLatencyMs: requestCount ? Math.round((totalLatencyMs / requestCount) * 100) / 100 : 0,
  };
}
