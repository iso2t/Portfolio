import { PostCard } from "nextra-theme-blog";
import { posts } from "./posts";

export const metadata = {
  title: "Blog",
  description: "Project updates and technical articles from ISO2T.",
};

export default function BlogPage() {
  return (
    <>
      <h1>Blog</h1>
      <p>Project updates, development notes, and technical articles.</p>
      {posts.map(post => <PostCard key={post.route} post={post} readMore="Read post" />)}
    </>
  );
}
