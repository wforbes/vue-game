module.exports = {
	root: true,
	env: {
	  node: true,
	},
	extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
	parserOptions: {
	  parser: "babel-eslint",
	},
	rules: {
	  //"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
	  "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
	  "no-undef": process.env.NODE_ENV === "production" ? "error" : "off",
	  //"no-unused-vars": process.env.NODE_ENV === "production" ? "error" : "off",
	  "no-redeclare": process.env.NODE_ENV === "production" ? "error" : "off",
	  "no-async-promise-executor": "off",
	  indent: ["error", "tab"],
	  "prettier/prettier": [
		  "warn",
		  {
			  useTabs: true,
			  trailingComma: "none",
			  endOfLine: "auto"
		  }
	  ]
  	},
  };