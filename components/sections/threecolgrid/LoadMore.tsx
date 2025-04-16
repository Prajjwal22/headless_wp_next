"use client";

import VerticalCard from "../../cards/vertical/VerticalCard";
import styles from "./ThreeColGrid.module.scss";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaEnvelope, FaFacebook, FaTwitter } from "react-icons/fa";
import Button from "../../button/Button";
import { FiCommand } from "react-icons/fi";
import { useEffect, useState } from "react";
import { getPaginatedPosts, getPosts } from "@/lib/wordpress";
import { getBlurImage } from "@/lib/utils";

// Default blur placeholder
const DEFAULT_BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMklEQVR4nAEnANj/ALKlos3U3fz8/ODDrwA3PkIQHiUTIigAFBoA8enfgIB8o5+c2NTOk8wT4KC5u6gAAAAASUVORK5CYII=";

type Props = {
  authorData?: {
    avatar: {
      url: string;
    };
    description: string;
    username: string;
    posts: {
      nodes: Posts[];
    };
  };
};

type PostWithBlur = Posts & {
  blurPlaceholder: string;
};

export default function LoadMore({ authorData }: Props) {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<PostWithBlur[]>([]);
  const [batchInfo, setBatchInfo] = useState({
    hasNextPage: true,
    endCursor: "",
  });

  const pathName: string | null = usePathname();

  let postCategory = "";
  if (pathName) {
    const catSlug = pathName.split("/");
    postCategory = catSlug[catSlug.length - 1];
  }

  let author = "lucid-dijkstra";

  const generateBlurPlaceholder = async (imageUrl: string) => {
    try {
      const blurPlaceholder = await getBlurImage(imageUrl);
      return blurPlaceholder?.base64 || DEFAULT_BLUR_PLACEHOLDER;
    } catch (error) {
      console.error("Error generating blur placeholder:", error);
      return DEFAULT_BLUR_PLACEHOLDER;
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPaginatedPosts(
          batchInfo.endCursor,
          postCategory,
          author
        );
        const { pageInfo, nodes } = data;
        
        // Generate blur placeholders for each post
        const postsWithBlur = await Promise.all(
          nodes.map(async (post: Posts) => {
            const blurPlaceholder = await generateBlurPlaceholder(
              post.featuredImage?.node?.sourceUrl || "/featured.png"
            );
            return {
              ...post,
              blurPlaceholder
            };
          })
        );
        
        setPosts(postsWithBlur);
        setBatchInfo(pageInfo);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const morePosts = await getPaginatedPosts(
        batchInfo.endCursor,
        postCategory,
        author
      );
      const { pageInfo, nodes } = morePosts;
      
      // Generate blur placeholders for new posts
      const newPostsWithBlur = await Promise.all(
        nodes.map(async (post: Posts) => {
          const blurPlaceholder = await generateBlurPlaceholder(
            post.featuredImage?.node?.sourceUrl || "/featured.png"
          );
          return {
            ...post,
            blurPlaceholder
          };
        })
      );
      
      setPosts((prevPosts) => [...prevPosts, ...newPostsWithBlur]);
      setBatchInfo(pageInfo);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.threecolGrid}>
      <div className={styles.gridTitle}>
        <h3 className="container">
          {pathName === "/"
            ? "What's New?"
            : "Latest Posts From " + postCategory}
        </h3>
      </div>
      {pathName && (pathName === "/" || pathName.includes("category") ? (
        ""
      ) : authorData ? (
        <div className={styles.authorBox}>
          <div className={styles.authorWrapper}>
            <Image
              src={authorData.avatar.url}
              width={100}
              height={100}
              alt={authorData.username}
            />
            <div className={styles.authorInfo}>
              <p>{authorData.description}</p>
              <span className={styles.authorSocial}>
                <span>
                  <FaFacebook size={20} />
                </span>
                <span>
                  <FaTwitter size={20} />
                </span>
                <span>
                  <FaEnvelope size={20} />
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        ""
      ))}
      <div className={styles.gridWrapper}>
        {pathName && (pathName === "/" || pathName.includes("/category")
          ? posts.map((post, index) => (
              <VerticalCard
                key={index}
                post={post}
                catSlug={postCategory}
                blurPlaceholder={post.blurPlaceholder}
              />
            ))
          : authorData
          ? authorData.posts.nodes.map((post, i) => {
              return (
                <>
                  <VerticalCard key={i} post={post} />
                </>
              );
            })
          : "")}
      </div>

      {batchInfo.hasNextPage ? (
        <Button
          onClick={() => handleLoadMore()}
          label={loading ? "Loading..." : "Load More"}
          icon={
            <FiCommand className={loading ? "loading-icon" : ""} size={20} />
          }
          center
          type="primaryBtn"
        />
      ) : (
        <p>✅ All posts loaded.</p>
      )}
    </div>
  );
}
