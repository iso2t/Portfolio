import { Layout } from "nextra-theme-blog";
import DocsLayout from "../_components/docs-layout";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsLayout>
      <div className="blog-shell">
        <Layout>
          <main id="nextra-skip-nav">{children}</main>
        </Layout>
      </div>
    </DocsLayout>
  );
}
