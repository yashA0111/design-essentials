export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatStepNumber(step: number): string {
  return String(step).padStart(2, "0");
}
