#!/usr/bin/env node

if (!module.parent) {
  require("yargs").command(require("./build")).argv;
} else {
  const {
    bundleTypes: { ESM_PROD }
  } = require("./build/bundles");
  const { getBabelOptions } = require("./build/babelOptions");

  module.exports = {
    babelOptions: getBabelOptions(ESM_PROD)
  };
}
