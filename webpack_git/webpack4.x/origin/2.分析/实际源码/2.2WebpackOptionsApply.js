
class WebpackOptionsApply extends OptionsApply {
	constructor() {
		super();
	}
	process(options, compiler) {
		let ExternalsPlugin;
		compiler.outputPath = options.output.path;
		compiler.recordsInputPath = options.recordsInputPath || options.recordsPath;
		compiler.recordsOutputPath =
			options.recordsOutputPath || options.recordsPath;
		compiler.name = options.name;

		compiler.dependencies = options.dependencies;
		if (typeof options.target === "string") {
			let JsonpTemplatePlugin;
			let FetchCompileWasmTemplatePlugin;
			let ReadFileCompileWasmTemplatePlugin;
			let NodeSourcePlugin;
			let NodeTargetPlugin;
			let NodeTemplatePlugin;
// 对于不同的target的处理
			switch (options.target) {
				case "web":
					JsonpTemplatePlugin = require("./web/JsonpTemplatePlugin");
					FetchCompileWasmTemplatePlugin = require("./web/FetchCompileWasmTemplatePlugin");
					NodeSourcePlugin = require("./node/NodeSourcePlugin");
					new JsonpTemplatePlugin().apply(compiler);
					new FetchCompileWasmTemplatePlugin({
						mangleImports: options.optimization.mangleWasmImports
					}).apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeSourcePlugin(options.node).apply(compiler);
					new LoaderTargetPlugin(options.target).apply(compiler);
					break;
				case "webworker": {
					let WebWorkerTemplatePlugin = require("./webworker/WebWorkerTemplatePlugin");
					FetchCompileWasmTemplatePlugin = require("./web/FetchCompileWasmTemplatePlugin");
					NodeSourcePlugin = require("./node/NodeSourcePlugin");
					new WebWorkerTemplatePlugin().apply(compiler);
					new FetchCompileWasmTemplatePlugin({
						mangleImports: options.optimization.mangleWasmImports
					}).apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeSourcePlugin(options.node).apply(compiler);
					new LoaderTargetPlugin(options.target).apply(compiler);
					break;
				}
				case "node":
				case "async-node":
					NodeTemplatePlugin = require("./node/NodeTemplatePlugin");
					ReadFileCompileWasmTemplatePlugin = require("./node/ReadFileCompileWasmTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					new NodeTemplatePlugin({
						asyncChunkLoading: options.target === "async-node"
					}).apply(compiler);
					new ReadFileCompileWasmTemplatePlugin({
						mangleImports: options.optimization.mangleWasmImports
					}).apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeTargetPlugin().apply(compiler);
					new LoaderTargetPlugin("node").apply(compiler);
					break;
				case "node-webkit":
					JsonpTemplatePlugin = require("./web/JsonpTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					new JsonpTemplatePlugin().apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeTargetPlugin().apply(compiler);
					new ExternalsPlugin("commonjs", "nw.gui").apply(compiler);
					new LoaderTargetPlugin(options.target).apply(compiler);
					break;
				case "electron-main":
					NodeTemplatePlugin = require("./node/NodeTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					new NodeTemplatePlugin({
						asyncChunkLoading: true
					}).apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeTargetPlugin().apply(compiler);
					new ExternalsPlugin("commonjs", [
						"app",
						"auto-updater",
						"browser-window",
						"clipboard",
						"content-tracing",
						"crash-reporter",
						"dialog",
						"electron",
						"global-shortcut",
						"ipc",
						"ipc-main",
						"menu",
						"menu-item",
						"native-image",
						"original-fs",
						"power-monitor",
						"power-save-blocker",
						"protocol",
						"screen",
						"session",
						"shell",
						"tray",
						"web-contents"
					]).apply(compiler);
					new LoaderTargetPlugin(options.target).apply(compiler);
					break;
				case "electron-renderer":
					JsonpTemplatePlugin = require("./web/JsonpTemplatePlugin");
					FetchCompileWasmTemplatePlugin = require("./web/FetchCompileWasmTemplatePlugin");
					NodeTargetPlugin = require("./node/NodeTargetPlugin");
					ExternalsPlugin = require("./ExternalsPlugin");
					new JsonpTemplatePlugin().apply(compiler);
					new FetchCompileWasmTemplatePlugin({
						mangleImports: options.optimization.mangleWasmImports
					}).apply(compiler);
					new FunctionModulePlugin().apply(compiler);
					new NodeTargetPlugin().apply(compiler);
					new ExternalsPlugin("commonjs", [
						"clipboard",
						"crash-reporter",
						"desktop-capturer",
						"electron",
						"ipc",
						"ipc-renderer",
						"native-image",
						"original-fs",
						"remote",
						"screen",
						"shell",
						"web-frame"
					]).apply(compiler);
					new LoaderTargetPlugin(options.target).apply(compiler);
					break;
				default:
					throw new Error("Unsupported target '" + options.target + "'.");
			}
		}
		// ...
		if (
			options.devtool &&
			(options.devtool.includes("sourcemap") ||
				options.devtool.includes("source-map"))
		) {
			// ...对devtool的处理
		}
//生成js代码? 是parse的一个解析器，如果文件是js就会用到这个parse，在loader时候进行
		new JavascriptModulesPlugin().apply(compiler); 
		new JsonModulesPlugin().apply(compiler);
		new WebAssemblyModulesPlugin({
			mangleImports: options.optimization.mangleWasmImports
		}).apply(compiler);
//入口的解析(SingleEntryPlugin/MultiEntryPlugin/DynamicEntryPlugin三者之一)，入口程序已经就绪等待后续命令
		new EntryOptionPlugin().apply(compiler); 
		compiler.hooks.entryOption.call(options.context, options.entry);

		new CompatibilityPlugin().apply(compiler);
		new HarmonyModulesPlugin(options.module).apply(compiler);
		new AMDPlugin(options.module, options.amd || {}).apply(compiler);
		new CommonJsPlugin(options.module).apply(compiler);
		new LoaderPlugin().apply(compiler);
		new NodeStuffPlugin(options.node).apply(compiler);
		new RequireJsStuffPlugin().apply(compiler);
		new APIPlugin().apply(compiler);
		new ConstPlugin().apply(compiler);
		new UseStrictPlugin().apply(compiler);
		new RequireIncludePlugin().apply(compiler);
		new RequireEnsurePlugin().apply(compiler);
		new RequireContextPlugin(
			options.resolve.modules,
			options.resolve.extensions,
			options.resolve.mainFiles
		).apply(compiler);
		new ImportPlugin(options.module).apply(compiler);
		new SystemPlugin(options.module).apply(compiler);

		if (typeof options.mode !== "string") {
			new WarnNoModeSetPlugin().apply(compiler);
		}

		new EnsureChunkConditionsPlugin().apply(compiler);
		if (options.optimization.removeAvailableModules) {
			new RemoveParentModulesPlugin().apply(compiler);
		}
		if (options.optimization.removeEmptyChunks) {
			new RemoveEmptyChunksPlugin().apply(compiler);
		}
		if (options.optimization.mergeDuplicateChunks) {
			new MergeDuplicateChunksPlugin().apply(compiler);
		}
		if (options.optimization.flagIncludedChunks) {
			new FlagIncludedChunksPlugin().apply(compiler);
		}
		if (options.optimization.sideEffects) {
			new SideEffectsFlagPlugin().apply(compiler);
		}
		if (options.optimization.providedExports) {
			new FlagDependencyExportsPlugin().apply(compiler);
		}
		if (options.optimization.usedExports) {
			new FlagDependencyUsagePlugin().apply(compiler);
		}
		if (options.optimization.concatenateModules) {
			new ModuleConcatenationPlugin().apply(compiler);
		}
		if (options.optimization.splitChunks) {
			new SplitChunksPlugin(options.optimization.splitChunks).apply(compiler);
		}
		if (options.optimization.runtimeChunk) {
			new RuntimeChunkPlugin(options.optimization.runtimeChunk).apply(compiler);
		}
		if (options.optimization.noEmitOnErrors) {
			new NoEmitOnErrorsPlugin().apply(compiler);
		}
		if (options.optimization.checkWasmTypes) {
			new WasmFinalizeExportsPlugin().apply(compiler);
		}
		let moduleIds = options.optimization.moduleIds;
		if (moduleIds === undefined) {
			// TODO webpack 5 remove all these options
			if (options.optimization.occurrenceOrder) {
				moduleIds = "size";
			}
			if (options.optimization.namedModules) {
				moduleIds = "named";
			}
			if (options.optimization.hashedModuleIds) {
				moduleIds = "hashed";
			}
			if (moduleIds === undefined) {
				moduleIds = "natural";
			}
		}
		if (moduleIds) {
			switch (moduleIds) {
				case "natural":
					// TODO webpack 5: see hint in Compilation.sortModules
					break;
				case "named":
					new NamedModulesPlugin().apply(compiler);
					break;
				case "hashed":
					new HashedModuleIdsPlugin().apply(compiler);
					break;
				case "size":
					new OccurrenceModuleOrderPlugin({
						prioritiseInitial: true
					}).apply(compiler);
					break;
				case "total-size":
					new OccurrenceModuleOrderPlugin({
						prioritiseInitial: false
					}).apply(compiler);
					break;
				default:
					throw new Error(
						`webpack bug: moduleIds: ${moduleIds} is not implemented`
					);
			}
		}
		let chunkIds = options.optimization.chunkIds;
		if (chunkIds === undefined) {
			// TODO webpack 5 remove all these options
			if (options.optimization.occurrenceOrder) {
				// This looks weird but it's for backward-compat
				// This bug already existed before adding this feature
				chunkIds = "total-size";
			}
			if (options.optimization.namedChunks) {
				chunkIds = "named";
			}
			if (chunkIds === undefined) {
				chunkIds = "natural";
			}
		}
		if (chunkIds) {
			switch (chunkIds) {
				case "natural":
					new NaturalChunkOrderPlugin().apply(compiler);
					break;
				case "named":
					// TODO webapck 5: for backward-compat this need to have OccurrenceChunkOrderPlugin too
					// The NamedChunksPlugin doesn't give every chunk a name
					// This should be fixed, and the OccurrenceChunkOrderPlugin should be removed here.
					new OccurrenceChunkOrderPlugin({
						prioritiseInitial: false
					}).apply(compiler);
					new NamedChunksPlugin().apply(compiler);
					break;
				case "size":
					new OccurrenceChunkOrderPlugin({
						prioritiseInitial: true
					}).apply(compiler);
					break;
				case "total-size":
					new OccurrenceChunkOrderPlugin({
						prioritiseInitial: false
					}).apply(compiler);
					break;
				default:
					throw new Error(
						`webpack bug: chunkIds: ${chunkIds} is not implemented`
					);
			}
		}
		if (options.optimization.nodeEnv) {
			new DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(options.optimization.nodeEnv)
			}).apply(compiler);
		}
		if (options.optimization.minimize) {
			for (const minimizer of options.optimization.minimizer) {
				if (typeof minimizer === "function") {
					minimizer.apply(compiler);
				} else {
					minimizer.apply(compiler);
				}
			}
		}

		if (options.performance) {
			new SizeLimitsPlugin(options.performance).apply(compiler);
		}

		new TemplatedPathPlugin().apply(compiler);

		new RecordIdsPlugin({
			portableIds: options.optimization.portableRecords
		}).apply(compiler);

		new WarnCaseSensitiveModulesPlugin().apply(compiler);

		if (options.cache) {
			const CachePlugin = require("./CachePlugin");
			new CachePlugin(
				typeof options.cache === "object" ? options.cache : null
			).apply(compiler);
		}
// 当插件的钩子都挂上后执行的钩子
		compiler.hooks.afterPlugins.call(compiler);
		if (!compiler.inputFileSystem) {
			throw new Error("No input filesystem provided");
		}
		// 各种路径解析的钩子
		compiler.resolverFactory.hooks.resolveOptions
			.for("normal")
			.tap("WebpackOptionsApply", resolveOptions => {
				return Object.assign(
					{
						fileSystem: compiler.inputFileSystem
					},
					options.resolve,
					resolveOptions
				);
			});
		compiler.resolverFactory.hooks.resolveOptions
			.for("context")
			.tap("WebpackOptionsApply", resolveOptions => {
				return Object.assign(
					{
						fileSystem: compiler.inputFileSystem,
						resolveToContext: true
					},
					options.resolve,
					resolveOptions
				);
			});
		compiler.resolverFactory.hooks.resolveOptions
			.for("loader")
			.tap("WebpackOptionsApply", resolveOptions => {
				return Object.assign(
					{
						fileSystem: compiler.inputFileSystem
					},
					options.resolveLoader,
					resolveOptions
				);
			});
		compiler.hooks.afterResolvers.call(compiler);
		return options;
	}
}

module.exports = WebpackOptionsApply;
