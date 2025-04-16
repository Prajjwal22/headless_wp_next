import { getAllPages, getPageBySlug } from "@/lib/wordpress";
import { Metadata } from "next";
import React from "react";

export default async function page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  let pageData = await getPageBySlug(slug);
  return (
    <div className="co">
      <h1>{pageData.title}</h1>
      <div
        className="mainContent"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      ></div>
    </div>
  );
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const pages = await getAllPages();


  const limitedPages = pages.slice(0, 4);

  return limitedPages.map((page: Posts) => ({
    slug: page.slug,
  }));
}


