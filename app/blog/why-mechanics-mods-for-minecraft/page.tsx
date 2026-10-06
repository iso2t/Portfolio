import { useMDXComponents as getBlogComponents } from "nextra-theme-blog";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { EvaluateResult } from "nextra";
import Article, { metadata as postMetadata } from "./article.mdx";

export const metadata = postMetadata;

// Nextra Blog 4.6.1 exports this wrapper at runtime but omits it from its types.
const { wrapper: Wrapper, ...blogComponents } = getBlogComponents() as
  ReturnType<typeof getBlogComponents> & {
    wrapper: ComponentType<{ children: ReactNode; metadata: EvaluateResult["metadata"] }>;
  };
const components = {
  ...blogComponents,
  h1: (props: ComponentProps<"h1">) => <h1 {...props} />,
  p: (props: ComponentProps<"p">) => <p {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol {...props} />,
  li: (props: ComponentProps<"li">) => <li {...props} />,
  hr: (props: ComponentProps<"hr">) => <hr {...props} />,
};

export default function BlogPost() {
  if (!Wrapper) throw new Error("The blog theme's article wrapper is missing.");
  return (
    <Wrapper metadata={postMetadata}>
      <Article components={components as MDXComponents} />
    </Wrapper>
  );
}
