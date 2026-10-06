import type { NextConfig } from "next";
import nextra from "nextra";
import { networkInterfaces } from "node:os";

const withNextra = nextra({});

const nextConfig: NextConfig = {
  // Allow phone testing through this computer's addresses without a wildcard origin.
  allowedDevOrigins: Object.values(networkInterfaces()).flatMap((interfaces) =>
    (interfaces ?? [])
      .filter((network) => network.family === "IPv4" && !network.internal)
      .map((network) => network.address),
  ),
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.tsx",
    },
  },
};

export default withNextra(nextConfig);
