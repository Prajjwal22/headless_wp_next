import Image from "next/image";
import Link from "next/link";

import { FaClock, FaUser } from "react-icons/fa";
import styles from "./OverlayCard.module.scss";
import { formatDate, getBlurImage } from "@/lib/utils";

type postProps = {
  post: Posts;
};

export default async function OverlayCard({ post }: postProps) {
  const featuredImage = post.featuredImage.node.sourceUrl;
  const postTitle = post.title;
  const authorName = post?.author?.node?.name || "Sophia James";
  const authorSlug = "/author/" + post?.author?.node?.slug;
  const pubDate = post.modified;
  const slug = post.slug;

  const placeholder = await getBlurImage(featuredImage);



  return (
    <div className={styles.overlayCard}>
      <div className={styles.cardWrapper}>
        <div className={styles.cardImage}>
          <Image
            src={`${featuredImage}.webp`}
            width="800"
            height="500"
            priority
            alt="featured image"
            placeholder="blur"
            blurDataURL={placeholder.base64}
          />

          <div className={styles.overlayGradient}></div>
          <div className={styles.cardContent}>
            <Link href={"/" + slug}>
              <h3 className={styles.cardTitle}>{postTitle}</h3>
            </Link>
            <div className={styles.cardMeta}>
              <Link href={authorSlug}>
                {" "}
                <span className={styles.cardAuthor}>
                  <FaUser /> {authorName}
                </span>
              </Link>
              <span className={styles.cardDate}>
                <FaClock />
                {formatDate(new Date(pubDate))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
