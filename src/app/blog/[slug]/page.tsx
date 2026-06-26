import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/siteContent";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { Badge } from "@/components/ui/badge";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="section-padding pt-32">
      <div className="container max-w-3xl">
        <Link
          href="/blog"
          className="text-nav mb-8 inline-block text-[var(--gold)] transition-colors hover:text-[var(--gold-muted)]"
        >
          ← Back to Blog
        </Link>

        <Badge
          variant="outline"
          className="mb-4 border-[var(--border)] text-[var(--text-secondary)]"
        >
          {post.category}
        </Badge>

        <h1 className="text-section mb-4 text-[var(--text-primary)]">
          {post.title}
        </h1>

        <time
          dateTime={post.date}
          className="text-nav text-[var(--text-tertiary)]"
        >
          {new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <div className="relative my-10 aspect-[16/9] overflow-hidden rounded-sm">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        <SectionLabel className="mb-6">ARTICLE</SectionLabel>
        <p className="text-body text-lg leading-relaxed">{post.excerpt}</p>
        <p className="text-body mt-6 leading-relaxed">
          At Design Essentials, we believe that great design starts with
          understanding — of the site, the client, and the story the space
          needs to tell. This article explores the principles and practices
          that guide our work in {post.category.toLowerCase()}, drawing on
          real project experience and industry insight.
        </p>
        <p className="text-body mt-6 leading-relaxed">
          Whether you&apos;re planning a new build, a fit-out, or an immersive
          brand environment, the fundamentals remain the same: clarity of
          vision, honesty of materials, and precision in execution. We invite
          you to explore our portfolio or reach out to discuss how these
          principles might apply to your project.
        </p>
      </div>
    </article>
  );
}
