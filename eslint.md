    "lint": "eslint --ext .js,.vue --ignore-path .gitignore .",
    "lint:fix": "eslint --fix --ext .js,.vue --ignore-path .gitignore .",

    "eslint": "^7.32.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-config-standard": "^16.0.3",
    "eslint-plugin-import": "^2.24.2",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^3.4.1",
    "eslint-plugin-promise": "^4.3.1",
    "eslint-plugin-risxss": "^2.1.0",
    "eslint-plugin-standard": "^5.0.0",
    "eslint-plugin-vue": "^7.19.1",
    "eslint-webpack-plugin": "^3.1.1",

const ESLintPlugin = require('eslint-webpack-plugin')

new ESLintPlugin({ extensions: ['js'], emitError: true, emitWarning: true, failOnError: true })
