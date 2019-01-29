#!/usr/bin/env node

const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const compiler = require("@ampproject/rollup-plugin-closure-compiler");
const { terser } = require("rollup-plugin-terser");
const replace = require("rollup-plugin-replace");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require("rollup-plugin-node-resolve");

const Bundles = require("./bundles");
const { ROOT_DIR, SOURCE_PATH } = require("../paths");
const {
  getBundleOutputPath,
  isProductionBundleType,
  isESMBundleType,
  isModernBundleType
} = require("./packaging");
const { getBabelOptions } = require("./babelOptions");

const pjson = require(path.join(ROOT_DIR, "package.json"));

const {
  CJS_DEV,
  CJS_PROD,
  ESM_DEV,
  ESM_PROD,
  ESM_MODERN_DEV,
  ESM_MODERN_PROD
} = Bundles.bundleTypes;

function getExternals(pjson) {
  const peerDeps = pjson.peerDependencies
    ? Object.keys(pjson.peerDependencies)
    : [];
  const allDeps = [].concat(peerDeps);

  return (id, parentId, isResolved) => {
    if (!isResolved) {
      if (allDeps.includes(id) || id.startsWith("@babel/runtime")) {
        return true;
      }
    }
    return false;
  };
}

function getFormat(bundleType) {
  switch (bundleType) {
    case CJS_DEV:
    case CJS_PROD:
      return "cjs";
    case ESM_DEV:
    case ESM_PROD:
    case ESM_MODERN_DEV:
    case ESM_MODERN_PROD:
      return "esm";
    default:
      throw new Error(`Unknown bundle type: ${bundleType}`);
  }
}

function getPlugins(bundleType) {
  const plugins = [];

  plugins.push(babel(getBabelOptions(bundleType)));

  plugins.push(resolve());
  plugins.push(commonjs());

  if (isProductionBundleType(bundleType)) {
    plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      })
    );
    plugins.push(compiler({}));
    plugins.push(
      terser({
        compress: {
          ecma: isModernBundleType(bundleType) ? 6 : 5,
          toplevel: true,
          unsafe_arrows: isModernBundleType(bundleType)
        },
        mangle: {
          toplevel: true,
          module: isESMBundleType(bundleType)
        }
      })
    );
  }

  return plugins;
}

async function buildBundle(bundleType) {
  const inputOptions = {
    input: SOURCE_PATH,
    external: getExternals(pjson),
    plugins: getPlugins(bundleType)
  };

  const outputOptions = {
    file: getBundleOutputPath(bundleType),
    format: getFormat(bundleType),
    sourcemap: true
  };

  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

module.exports = { buildBundle };
