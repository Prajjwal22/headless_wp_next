import SinglePost from "@/components/templates/SinglePost";
import RelatedPosts from "@/components/widgets/relatedPosts/RelatedPosts";
import { getBlurImage } from "@/lib/utils";
import { getAllParams, getPostBySlug } from "@/lib/wordpress";
import React from "react";

type SingleProps = {
  slug: string;
};

export default async function PostPage({ slug }: SingleProps) {
  const post = await getPostBySlug(slug);
  const postsByCategory = post.categories.nodes[0].posts.nodes.slice(0, 4);

  const relatedPosts = postsByCategory.filter(
    (relPost: Posts) => relPost.title !== post.title
  );

  // const placeholder = await getBlurImage(
  //   post.featuredImage?.node?.sourceUrl || "/featured.png"
  // );
  return (
    <>
      {/* <SinglePost post={post} placeholder={placeholder?.base64} /> */}
      <SinglePost post={post} />

      <RelatedPosts relatedPosts={relatedPosts} />
    </>
  );
}
