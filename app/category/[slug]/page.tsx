import LoadMore from "@/components/sections/threecolgrid/LoadMore";
import { getAllCategories, getPostBySlug } from "@/lib/wordpress";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";

type Props = {
  params: { slug: string };
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return (
    <div>
      <LoadMore />
    </div>
  );
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const categories = await getAllCategories();


  const limitedCategories = categories.slice(0, 4);
  return limitedCategories.map((cat: Posts) => ({
    slug: cat.slug,
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
    title: `Articles from ${slug}`,
    description: `Read all the Articles from ${slug} archive...`,
    alternates: {
      canonical: `https://howtoshout.com/category/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
