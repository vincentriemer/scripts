const path = require("path");
const invariant = require("invariant");
const appRoot = require("app-root-path");

const ROOT_DIR = appRoot.path;
const RESULTS_PATH = path.join(ROOT_DIR, "results.json");

const SCRIPT_DIR = __dirname;
const BUILD_DIR = path.resolve(SCRIPT_DIR, "./build");
const TEMPLATE_DIR = path.resolve(BUILD_DIR, "./templates");

const pjson = require(path.resolve(ROOT_DIR, "./package.json"));
const SOURCE_PATH = path.resolve(ROOT_DIR, pjson.source);
const CJS_PATH = path.resolve(ROOT_DIR, pjson.main);
const ESM_PATH = path.resolve(ROOT_DIR, pjson.module);
const ESM_MODERN_PATH = path.resolve(ROOT_DIR, pjson["module:modern"]);

const LIB_DIR = (() => {
  const testSet = new Set(
    [CJS_PATH, ESM_PATH, ESM_MODERN_PATH].map(path.dirname)
  );
  invariant(
    testSet.size === 1,
    "CommonJS, ESM, and Modern ESM build must be in the same path"
  );
  return Array.from(testSet)[0];
})();

module.exports = {
  SCRIPT_DIR,
  RESULTS_PATH,
  ROOT_DIR,
  LIB_DIR,
  SOURCE_PATH,
  TEMPLATE_DIR,
  CJS_PATH,
  ESM_PATH,
  ESM_MODERN_PATH
};
