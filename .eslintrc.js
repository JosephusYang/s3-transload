module.exports = {
  "parserOptions": {
    "ecmaVersion": 6
  },
  "plugins": [
    "mocha",
    "prettier"
  ],
  "extends": [
    "problems",
  ],
  "env" : {
    "node": true
  },
  "rules": {
    "prettier/prettier": "error"
  },
  "overrides": [
    {
      "files": ["*.spec.js"],
      "env": {
        "mocha": true
      },

      "rules": {
        "mocha/no-setup-in-describe": "off",
        "prefer-arrow-callback": "off",
        "mocha/no-identical-title": "error",
        "mocha/no-mocha-arrows": "error", // https://mochajs.org/#arrow-functions
        "mocha/handle-done-callback": "error",
        "mocha/no-exclusive-tests": "error",
        "mocha/no-global-tests": "error",
        "mocha/no-nested-tests": "error",
        "mocha/no-return-and-callback": "error",
        "mocha/no-sibling-hooks": "error",
      }
    }
  ]
}
