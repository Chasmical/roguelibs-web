if (process.env.NODE_ENV === "development") {
  module.exports.jsxRuntime = require("react/jsx-dev-runtime");
} else {
  module.exports.jsxRuntime = require("react/jsx-runtime");
}
