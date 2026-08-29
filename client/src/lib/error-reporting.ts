export function reportError(error: unknown, context: Record<string, unknown> = {}): void {
  console.error("Application error", { error, ...context });
}