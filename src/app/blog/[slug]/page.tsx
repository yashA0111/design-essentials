import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPostBySlug } from "@/lib/data/siteContent";
import { toSlugParams } from "@/lib/data/query";
import { formatDate } from "@/lib/format";
import { metadataFromSeo } from "@/lib/seo";
import { GOLD_LINK } from "@/lib/styles";
import type { SlugPageProps } from "@/types/page";
import { SectionLabel } from "@/components/common/SectionLabel";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { CategoryBadge } from "@/components/common/CategoryBadge";

export async function generateStaticParams() {
  return toSlugParams(blogPosts);
}

export async function generateMetadata({
  params,
}: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  return metadataFromSeo(getBlogPostBySlug(slug)?.seo);
}

export default async function BlogPostPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="section-padding pt-32">
      <div className="container max-w-3xl">
        <Link
          href="/blog"
          className={`text-nav mb-8 inline-block ${GOLD_LINK}`}
        >
          ← Back to Blog
        </Link>

        <CategoryBadge className="mb-4">{post.category}</CategoryBadge>

        <h1 className="text-section mb-4 text-(--text-primary)">
          {post.title}
        </h1>

        <time dateTime={post.date} className="text-nav text-(--text-tertiary)">
          {formatDate(post.date)}
        </time>

        <div className="relative my-10 aspect-16/9 overflow-hidden rounded-sm">
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
