

(function() {

	
		const importLocal = require("import-local");
		// Prefer the local installation of webpack-cli
		if (importLocal(__filename)) {
			return;
		}

		require("v8-compile-cache");
	// ...

		const yargs = require("yargs").usage(`webpack-cli ${
			require("../package.json").version
		}

	Usage: webpack-cli [options]
				webpack-cli [options] --entry <entry> --output <output>
				webpack-cli [options] <entries...> --output <output>
				webpack-cli <command> [options]

	For more information, see https://webpack.js.org/api/cli/.`);

		require("./config-yargs")(yargs);

		const DISPLAY_GROUP = "Stats options:";
		const BASIC_GROUP = "Basic options:";
	
	yargs.options({
		silent: {
			type: "boolean",
			describe: "Prevent output from being displayed in stdout"
		},
		json: {
			type: "boolean",
			alias: "j",
			describe: "Prints the result as JSON."
		},
		progress: {
			type: "boolean",
			describe: "Print compilation progress in percentage",
			group: BASIC_GROUP
		},
		color: {
			type: "boolean",
			alias: "colors",
			default: function supportsColor() {
				if (process.stdout.isTTY === true) {
					return require("supports-color").supportsColor;
				}
			},
			group: DISPLAY_GROUP,
			describe: "Enables/Disables colors on the console"
		},
		"sort-modules-by": {
			type: "string",
			group: DISPLAY_GROUP,
			describe: "Sorts the modules list by property in module"
		},
		"sort-chunks-by": {
			type: "string",
			group: DISPLAY_GROUP,
			describe: "Sorts the chunks list by property in chunk"
		},
		"sort-assets-by": {
			type: "string",
			group: DISPLAY_GROUP,
			describe: "Sorts the assets list by property in asset"
		},
		"hide-modules": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Hides info about modules"
		},
		"display-exclude": {
			type: "string",
			group: DISPLAY_GROUP,
			describe: "Exclude modules in the output"
		},
		"display-modules": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display even excluded modules in the output"
		},
		"display-max-modules": {
			type: "number",
			group: DISPLAY_GROUP,
			describe: "Sets the maximum number of visible modules in output"
		},
		"display-chunks": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display chunks in the output"
		},
		"display-entrypoints": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display entry points in the output"
		},
		"display-origins": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display origins of chunks in the output"
		},
		"display-cached": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display also cached modules in the output"
		},
		"display-cached-assets": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display also cached assets in the output"
		},
		"display-reasons": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display reasons about module inclusion in the output"
		},
		"display-depth": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display distance from entry point for each module"
		},
		"display-used-exports": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe:
				"Display information about used exports in modules (Tree Shaking)"
		},
		"display-provided-exports": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display information about exports provided from modules"
		},
		"display-optimization-bailout": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe:
				"Display information about why optimization bailed out for modules"
		},
		"display-error-details": {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Display details about errors"
		},
		display: {
			type: "string",
			choices: [
				"",
				"verbose",
				"detailed",
				"normal",
				"minimal",
				"errors-only",
				"none"
			],
			group: DISPLAY_GROUP,
			describe: "Select display preset"
		},
		verbose: {
			type: "boolean",
			group: DISPLAY_GROUP,
			describe: "Show more details"
		},
		"info-verbosity": {
			type: "string",
			default: "info",
			choices: ["none", "info", "verbose"],
			group: DISPLAY_GROUP,
			describe:
				"Controls the output of lifecycle messaging e.g. Started watching files..."
		},
		"build-delimiter": {
			type: "string",
			group: DISPLAY_GROUP,
			describe: "Display custom text after build output"
		}
	});

	yargs.parse(process.argv.slice(2), (err, argv, output) => {
	//...

		let options;
		try {
			options = require("./convert-argv")(argv); //读取命令行参数
		} catch (err) {
			// ...
		}
		// ...

		function processOptions(options) {
			// process Promise
			if (typeof options.then === "function") {
				options.then(processOptions).catch(function(err) {
					console.error(err.stack || err);
					process.exit(1); // eslint-disable-line
				});
				return;
			}

			const firstOptions = [].concat(options)[0];
			const statsPresetToOptions = require("webpack").Stats.presetToOptions;

			let outputOptions = options.stats;
			// ...

			const webpack = require("webpack");

			let lastHash = null;
			let compiler;
			try {
				compiler = webpack(options);
			} catch (err) {
				// ...
			}

			// ...
			compiler.run(compilerCallback);
		}

		processOptions(options);
	});
})();
