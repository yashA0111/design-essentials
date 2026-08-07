import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/siteContent";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/common/PageHeader";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { CategoryBadge } from "@/components/common/CategoryBadge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on architecture, interior design, sustainability, and experience design from the Design Essentials team.",
};

export default function BlogPage() {
  return (
    <PageHeader eyebrow="INSIGHTS" title="Blog" titleClassName="mb-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group border border-border bg-(--surface) transition-colors hover:border-(--gold-muted)"
          >
            <div className="relative aspect-16/10 overflow-hidden">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition-transform duration-(--dur-base) group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6">
              <CategoryBadge className="mb-3">{post.category}</CategoryBadge>
              <h2 className="text-card-title mb-3 text-(--text-primary) transition-colors group-hover:text-(--gold)">
                {post.title}
              </h2>
              <p className="text-body mb-4 line-clamp-2 text-sm">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <time
                  dateTime={post.date}
                  className="text-nav text-(--text-tertiary)"
                >
                  {formatDate(post.date)}
                </time>
                <span className="text-nav text-(--gold)">Read More →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageHeader>
  );
}
