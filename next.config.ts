import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
  },
  webpack(config) {
    // Find the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    );

    if (fileLoaderRule) {
      config.module.rules.push(
        // Reapply the existing rule, but only for svg imports ending in ?url
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/, // *.svg?url
        },
        // Convert all other *.svg imports to React components
        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...(fileLoaderRule.resourceQuery?.not || []), /url/] }, // exclude if *.svg?url
          use: [{
            loader: '@svgr/webpack',
            options: {
              typescript: true,
              ext: 'tsx',
            }
          }],
        }
      );

      // Modify the file loader rule to ignore *.svg, since we have it handled now.
      if (fileLoaderRule.exclude) {
        if (Array.isArray(fileLoaderRule.exclude)) {
          fileLoaderRule.exclude.push(/\.svg$/i);
        } else {
          fileLoaderRule.exclude = [fileLoaderRule.exclude, /\.svg$/i];
        }
      } else {
        fileLoaderRule.exclude = /\.svg$/i;
      }
    } else {
      // If no existing SVG rule, add our own
      config.module.rules.push({
        test: /\.svg$/i,
        resourceQuery: { not: [/url/] }, // exclude if *.svg?url
        use: [{
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            ext: 'tsx',
          }
        }],
      });
    }

    return config;
  },
};

export default nextConfig;
