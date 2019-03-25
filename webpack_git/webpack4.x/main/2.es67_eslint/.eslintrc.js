module.exports = {
	"parser": "babel-eslint",
	"parserOptions": {
	  "ecmaVersion": 2018,
	  "sourceType": "module"
	},
	"extends": [
	  "airbnb-base"
	],
	"globals": {
	  "__DEV__": true,
	  "__dirname": false,
	  "__fbBatchedBridgeConfig": false,
	  "cancelAnimationFrame": false,
	  "clearImmediate": true,
	  "clearInterval": false,
	  "clearTimeout": false,
	  "console": true,
	  "document": false,
	  "escape": false,
	  "exports": false,
	  "fetch": false,
	  "global": false,
	  "jest": false,
	  "Map": true,
	  "module": false,
	  "navigator": false,
	  "process": false,
	  "Promise": true,
	  "requestAnimationFrame": true,
	  "require": false,
	  "Set": true,
	  "setImmediate": true,
	  "setInterval": false,
	  "setTimeout": false,
	  "window": false,
	  "XMLHttpRequest": false,
	  "alert": true,
	  "pit": false,
	  "BaseStyleSheet": false,
	  "NOOP": false,
	  "MeScroll": true
	},
	"rules": {
	  "semi": "off",
	  "object-curly-spacing": [2, "never"], // 括号前后禁止使用空格
	  "no-use-before-define": "off",
	  "no-unused-expressions": "off",
	  "no-console": 2,
	  "max-len": [
		2,
		180,
		4,
		{
		  "ignoreUrls": true
		}
	  ],
	  "object-curly-newline": "off",
  
	  "class-methods-use-this": "off",
	  "arrow-body-style": "off",
	  "no-plusplus": "off",
	  "import/prefer-default-export": "off",
	  "global-require": "off",
	  "consistent-return": "off",
  //    "indent": "off",
	  "no-underscore-dangle": "off",
	  "comma-dangle": "off",
	  "import/no-extraneous-dependencies": "off",
	  "padded-blocks": "off",
	  "no-prototype-builtins": "off",
	  "no-restricted-syntax": "off",
	  "no-mixed-operators": "off",
	  "no-else-return": "off",
	  "no-floating-decimal": "off",
	  "one-var": "off",
	  "radix": "off",
	  "prefer-const": "off",
	  "no-bitwise": "warn",
	  "no-nested-ternary": "warn",
	  "no-continue": "off",
	  "keyword-spacing": [2, {
		"overrides": {
		  "if": { "after": false },
		  "for": { "after": false },
		  "while": { "after": false },
		  "catch": { "after": false }
		}
	  }],
	  "func-names": ["error", "never"]
	},
	"env": {
	  "browser": true,
	  "commonjs": true,
	  "es6": true,
	  "jquery": true
	},
	"settings": {
	  "import/resolver": {
		"webpack": {
		  "config": "./_server/build/webpack/default.conf.js"
		}
	  }
	}
  }
  