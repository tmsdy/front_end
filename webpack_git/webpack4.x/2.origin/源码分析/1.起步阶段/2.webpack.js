
const webpack = (options, callback) => {
    // ...
    // 把在webpack.config.js里的配置覆盖webpack默认的配置
    options = new WebpackOptionsDefaulter().process(options);
    compiler = new Compiler(options.context); //Compiler核心编译器类，控制webpack打包的
    compiler.options = options;
    new NodeEnvironmentPlugin().apply(compiler); //注册插件，给Compiler赋予node操作文件的能力。
    for (const plugin of options.plugins) { // 注册所有自定义的插件
        plugin.apply(compiler);
    }
    // options配置挂一些插件 + 挂各种内置插件
    compiler.options = new WebpackOptionsApply().process(options, compiler);
    // ...
    return compiler;
}

exports = module.exports = webpack;
exports.version = version;

webpack.WebpackOptionsDefaulter = WebpackOptionsDefaulter;
webpack.WebpackOptionsApply = WebpackOptionsApply;
webpack.Compiler = Compiler;
webpack.MultiCompiler = MultiCompiler;
webpack.NodeEnvironmentPlugin = NodeEnvironmentPlugin;
// @ts-ignore Global @this directive is not supported
webpack.validate = validateSchema.bind(this, webpackOptionsSchema);
webpack.validateSchema = validateSchema;
webpack.WebpackOptionsValidationError = WebpackOptionsValidationError;

const exportPlugins = (obj, mappings) => {
    for (const name of Object.keys(mappings)) {
        Object.defineProperty(obj, name, {
            configurable: false,
            enumerable: true,
            get: mappings[name]
        });
    }
};

exportPlugins(exports, {
    AutomaticPrefetchPlugin: () => require("./AutomaticPrefetchPlugin"),
    BannerPlugin: () => require("./BannerPlugin"),
    CachePlugin: () => require("./CachePlugin"),
    ContextExclusionPlugin: () => require("./ContextExclusionPlugin"),
    ContextReplacementPlugin: () => require("./ContextReplacementPlugin"),
    DefinePlugin: () => require("./DefinePlugin"),
    Dependency: () => require("./Dependency"),
    DllPlugin: () => require("./DllPlugin"),
    DllReferencePlugin: () => require("./DllReferencePlugin"),
    EnvironmentPlugin: () => require("./EnvironmentPlugin"),
    EvalDevToolModulePlugin: () => require("./EvalDevToolModulePlugin"),
    EvalSourceMapDevToolPlugin: () => require("./EvalSourceMapDevToolPlugin"),
    ExtendedAPIPlugin: () => require("./ExtendedAPIPlugin"),
    ExternalsPlugin: () => require("./ExternalsPlugin"),
    HashedModuleIdsPlugin: () => require("./HashedModuleIdsPlugin"),
    HotModuleReplacementPlugin: () => require("./HotModuleReplacementPlugin"),
    IgnorePlugin: () => require("./IgnorePlugin"),
    LibraryTemplatePlugin: () => require("./LibraryTemplatePlugin"),
    LoaderOptionsPlugin: () => require("./LoaderOptionsPlugin"),
    LoaderTargetPlugin: () => require("./LoaderTargetPlugin"),
    MemoryOutputFileSystem: () => require("./MemoryOutputFileSystem"),
    Module: () => require("./Module"),
    ModuleFilenameHelpers: () => require("./ModuleFilenameHelpers"),
    NamedChunksPlugin: () => require("./NamedChunksPlugin"),
    NamedModulesPlugin: () => require("./NamedModulesPlugin"),
    NoEmitOnErrorsPlugin: () => require("./NoEmitOnErrorsPlugin"),
    NormalModuleReplacementPlugin: () =>
        require("./NormalModuleReplacementPlugin"),
    PrefetchPlugin: () => require("./PrefetchPlugin"),
    ProgressPlugin: () => require("./ProgressPlugin"),
    ProvidePlugin: () => require("./ProvidePlugin"),
    SetVarMainTemplatePlugin: () => require("./SetVarMainTemplatePlugin"),
    SingleEntryPlugin: () => require("../Compiler/3.1SingleEntryPlugin"),
    SourceMapDevToolPlugin: () => require("./SourceMapDevToolPlugin"),
    Stats: () => require("./Stats"),
    Template: () => require("./Template"),
    UmdMainTemplatePlugin: () => require("./UmdMainTemplatePlugin"),
    WatchIgnorePlugin: () => require("./WatchIgnorePlugin")
});
exportPlugins((exports.dependencies = {}), {
    DependencyReference: () => require("./dependencies/DependencyReference")
});
exportPlugins((exports.optimize = {}), {
    AggressiveMergingPlugin: () => require("./optimize/AggressiveMergingPlugin"),
    AggressiveSplittingPlugin: () =>
        require("./optimize/AggressiveSplittingPlugin"),
    ChunkModuleIdRangePlugin: () =>
        require("./optimize/ChunkModuleIdRangePlugin"),
    LimitChunkCountPlugin: () => require("./optimize/LimitChunkCountPlugin"),
    MinChunkSizePlugin: () => require("./optimize/MinChunkSizePlugin"),
    ModuleConcatenationPlugin: () =>
        require("./optimize/ModuleConcatenationPlugin"),
    OccurrenceOrderPlugin: () => require("./optimize/OccurrenceOrderPlugin"),
    OccurrenceModuleOrderPlugin: () =>
        require("./optimize/OccurrenceModuleOrderPlugin"),
    OccurrenceChunkOrderPlugin: () =>
        require("./optimize/OccurrenceChunkOrderPlugin"),
    RuntimeChunkPlugin: () => require("./optimize/RuntimeChunkPlugin"),
    SideEffectsFlagPlugin: () => require("./optimize/SideEffectsFlagPlugin"),
    SplitChunksPlugin: () => require("./optimize/SplitChunksPlugin")
});
exportPlugins((exports.web = {}), {
    FetchCompileWasmTemplatePlugin: () =>
        require("./web/FetchCompileWasmTemplatePlugin"),
    JsonpTemplatePlugin: () => require("./web/JsonpTemplatePlugin")
});
exportPlugins((exports.webworker = {}), {
    WebWorkerTemplatePlugin: () => require("./webworker/WebWorkerTemplatePlugin")
});
exportPlugins((exports.node = {}), {
    NodeTemplatePlugin: () => require("./node/NodeTemplatePlugin"),
    ReadFileCompileWasmTemplatePlugin: () =>
        require("./node/ReadFileCompileWasmTemplatePlugin")
});
exportPlugins((exports.debug = {}), {
    ProfilingPlugin: () => require("./debug/ProfilingPlugin")
});
exportPlugins((exports.util = {}), {
    createHash: () => require("./util/createHash")
});

const defineMissingPluginError = (namespace, pluginName, errorMessage) => {
    Object.defineProperty(namespace, pluginName, {
        configurable: false,
        enumerable: true,
        get() {
            throw new RemovedPluginError(errorMessage);
        }
    });
};

// TODO remove in webpack 5
defineMissingPluginError(
    exports.optimize,
    "UglifyJsPlugin",
    "webpack.optimize.UglifyJsPlugin has been removed, please use config.optimization.minimize instead."
);

// TODO remove in webpack 5
defineMissingPluginError(
    exports.optimize,
    "CommonsChunkPlugin",
    "webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead."
);
