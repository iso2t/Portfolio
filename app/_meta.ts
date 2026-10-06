import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: "Documentation",
  "heavy-inventories": { title: "Heavy Inventories", type: "page" },
  sverve: { title: "Sverve", type: "page" },
  "easy-config": { title: "Easy Config", type: "page" },
  issues: {
    title: "Issues",
    type: "page",
    href: "https://issues.iso2t.com",
  },
  blog: {
    title: "Blog",
    type: "page",
    theme: { sidebar: false, toc: false, pagination: false, typesetting: "article" },
  },
  about: {
    title: "About",
    type: "page",
    theme: { sidebar: false, toc: false, pagination: false },
  },
};

export default meta;
