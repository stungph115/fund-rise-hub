module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/react-in-jsx-scope": "off",
        "react/prop-types": "off",
        "no-mixed-spaces-and-tabs": "error",
        "no-trailing-spaces": "error",
        "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
        "react/no-unescaped-entities": 1,
        "react/display-name": 1,
        "no-unused-vars": 1,
        "no-empty-pattern": 1
    }
}
