module.exports = {
  "parserOptions": {
    "ecmaVersion": 6
  },
  "plugins": [
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
  }
}
