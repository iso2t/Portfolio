import type { Metadata } from "next";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import "nextra-theme-docs/style.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ISO2T Documentation", template: "%s | ISO2T" },
  description: "Documentation, guides, and development notes for ISO2T projects.",
  icons: {
    icon: { url: "/logo.svg", type: "image/svg+xml", sizes: "any" },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head />
      {/* Extensions can add body attributes before React hydrates. */}
      <body suppressHydrationWarning>
        <Layout
          navbar={<Navbar logo={<b>ISO2T</b>} projectLink="https://github.com/iso2t" />}
          pageMap={await getPageMap()}
          editLink={null}
          feedback={{ content: null }}
          footer={<Footer>© {new Date().getFullYear()} ISO2T</Footer>}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
