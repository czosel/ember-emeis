"use strict";

module.exports = {
  settings: {
    "import/internal-regex": "^ember-emeis/",
  },
  extends: ["@adfinis-sygroup/eslint-config/ember-addon"],
  overrides: [
    ...require("@adfinis-sygroup/eslint-config/ember-addon").overrides,
};
