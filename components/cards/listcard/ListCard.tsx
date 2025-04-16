import Image from "next/image";
import Link from "next/link";

import styles from "./ListCard.module.scss";
import { formatDate, getBlurImage } from "@/lib/utils";

type postProps = {
  post: Posts;
};

export default async function ListCard({ post }: postProps) {
  const featuredImage = post.featuredImage.node.sourceUrl;
  const postTitle = post.title;
  const authorName = post.author?.node.name || "Shophia";
  const authorSlug = "/author/" + (post.author?.node.slug || "#");
  const pubDate = post.modified;
  const category = post.categories.nodes[0].name;
  const slug = post.slug;

  const placeholder = await getBlurImage(featuredImage);

  return (
    <div className={styles.listCard}>
      <Link href={"/category/" + post.categories.nodes[0].slug}>
        <div className={styles.cardCategory}>{category}</div>
      </Link>
      <div className={styles.cardTitle}>
        <Link href={slug}>
          <h3 dangerouslySetInnerHTML={{ __html: postTitle }}></h3>
        </Link>
        <span className={styles.cardMeta}>
          <Link href={authorSlug}>
            <span className={styles.cardAuthor}>{authorName}</span>
          </Link>
          <span className={styles.cardTime}>
            {formatDate(new Date(pubDate))}
          </span>
        </span>
      </div>
      <div className={styles.cardThumb}>
        <Image
          width={100}
          height={100}
          src={`${featuredImage}.webp`}
          alt={post.title}
          placeholder="blur"
          blurDataURL={placeholder?.base64}
        />
      </div>
    </div>
  );
}
