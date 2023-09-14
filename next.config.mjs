/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
  },

  rewrites: async () => [
    { source: "/m/:mod_slug", destination: "/mods/:mod_slug" },
    { source: "/u/:user_slug", destination: "/users/:user_slug" },
  ],

  webpack: config => {
    const rules = config.module.rules
      .find(rule => typeof rule.oneOf === "object")
      .oneOf.filter(rule => Array.isArray(rule.use));

    rules.forEach(rule => {
      rule.use.forEach(moduleLoader => {
        if (moduleLoader.loader?.includes("css-loader") && !moduleLoader.loader?.includes("postcss-loader")) {
          const options = moduleLoader.options?.modules;
          options && (options.exportLocalsConvention = "camelCaseOnly");
        }
      });
    });

    return config;
  },
};

export default nextConfig;
