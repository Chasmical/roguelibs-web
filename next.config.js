/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },

  // https://stackoverflow.com/a/69166434/16397889
  webpack: (config, { dev }) => {
    const rules = config.module.rules
      .find(rule => typeof rule.oneOf === "object")
      .oneOf.filter(rule => Array.isArray(rule.use));

    rules.forEach(rule => {
      rule.use.forEach(moduleLoader => {
        if (moduleLoader.loader?.includes("css-loader") && !moduleLoader.loader?.includes("postcss-loader")) {
          const options = moduleLoader.options.modules;
          // if (!dev) options.getLocalIdent = optimizedIdent;
          options.exportLocalsConvention = "camelCaseOnly";
        }
      });
    });

    return config;
  },
};
module.exports = nextConfig;

// CSS class name optimization based on https://github.com/kenmueller/next-optimized-classnames

const { relative } = require("path");
const generateCssClass = require("css-class-generator");

const classNames = {};
let index = 0;

const getName = key => {
  return Object.prototype.hasOwnProperty.call(classNames, key)
    ? classNames[key]
    : (classNames[key] = generateCssClass(index++));
};
const getKey = ({ rootContext, resourcePath }, name) => {
  return `${relative(rootContext, resourcePath).replace(/\\+/g, "/")}#${name}`;
};
const optimizedIdent = (context, _, exportName) => {
  return getName(getKey(context, exportName));
};
