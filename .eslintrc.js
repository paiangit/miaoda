const { camelCase } = require("lodash");

module.exports = {
  plugins: ['css-modules'],
  extends: [
    'plugin:css-modules/recommended'
  ],
  rules: {
    'css-modules/no-unused-class': [2, { camelCase: true }],
    'css-modules/no-undef-class': [2, { camelCase: true }]
  }
}
