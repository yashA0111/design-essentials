export function findBySlug<T extends { slug: string }>(
  items: readonly T[],
  slug: string
): T | undefined {
  return items.find((item) => item.slug === slug);
}

export function findById<T extends { id: string }>(
  items: readonly T[],
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}

export function toSlugParams(
  items: readonly { slug: string }[]
): { slug: string }[] {
  return items.map((item) => ({ slug: item.slug }));
}
