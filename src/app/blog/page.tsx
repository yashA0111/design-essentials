import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights on architecture, interior design, sustainability, and experience design from the Design Essentials team.",
};

export default function BlogPage() {
  return (
    <section className="section-padding pt-32">
      <div className="container">
        <SectionLabel className="mb-6">INSIGHTS</SectionLabel>
        <h1 className="text-section mb-16 text-(--text-primary)">Blog</h1>

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
                <Badge
                  variant="outline"
                  className="mb-3 border-border text-(--text-secondary)"
                >
                  {post.category}
                </Badge>
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
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span className="text-nav text-(--gold)">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
