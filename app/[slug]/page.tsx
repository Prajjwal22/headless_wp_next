import PostPage from "@/components/templates/PostPage";
import { getAllParams, getPostBySlug } from "@/lib/wordpress";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
};
export default function SinglePostPage({ params }: Props) {
  const { slug } = params;

  return <PostPage slug={slug} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const posts = await getAllParams();
  
  // Limit to first 4 posts for static generation
  const limitedPosts = posts.slice(0, 4);

  return limitedPosts.map((post: Posts) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug;
  const post = await getPostBySlug(slug);
  // fetch data

  // optionally access and extend (rather than replace) parent metadata

  return {
    title: post.title,
    description: post?.seo.metaDesc,

    openGraph: {
      images: post.featuredImage.node.sourceUrl,
    },
    alternates: {
      canonical: `https://howtoshout.com/${post?.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
