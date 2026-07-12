export function delay(ms = 400) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
