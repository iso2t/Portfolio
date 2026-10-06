import { getPageMap } from "nextra/page-map";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { ThemeSwitch } from "nextra-theme-blog";
import { FooterLinks } from "./footer-links";

export default async function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout
      navbar={
        <Navbar logo={<b>ISO2T</b>} projectLink="https://github.com/iso2t">
          <ThemeSwitch />
        </Navbar>
      }
      pageMap={await getPageMap()}
      darkMode={false}
      editLink={null}
      feedback={{ content: null }}
      footer={<Footer><FooterLinks /></Footer>}
    >
      {children}
    </Layout>
  );
}
