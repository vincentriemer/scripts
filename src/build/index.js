const build = require("./build");

exports.command = "build";
exports.describe = "Build all the bundles";
exports.handler = argv => {
  build();
};
