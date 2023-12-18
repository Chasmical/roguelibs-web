/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},

  rewrites: async () => [
    { source: "/tos", destination: "/terms-of-service" },
    { source: "/privacy", destination: "/privacy-policy" },
    { source: "/m/:mod_slug", destination: "/mods/:mod_slug" },
    { source: "/u/:user_slug", destination: "/users/:user_slug" },
  ],
  redirects: async () => [
    // wiki redirects
    { source: "/mods/:path*", destination: "https://roguelibs.com/mods/:path*", permanent: true },
    { source: "/docs/:path*", destination: "https://roguelibs.com/docs/:path*", permanent: true },
    { source: "/tools/:path*", destination: "https://roguelibs.com/tools/:path*", permanent: true },
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
