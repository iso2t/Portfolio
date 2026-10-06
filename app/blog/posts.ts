import { metadata } from "./why-mechanics-mods-for-minecraft/article.mdx";

export const posts = [
  {
    route: "/blog/why-mechanics-mods-for-minecraft",
    frontMatter: {
      title: metadata.title,
      description: metadata.description ?? undefined,
    },
  },
];
