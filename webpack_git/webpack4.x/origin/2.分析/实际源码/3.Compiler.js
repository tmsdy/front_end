
class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = {
			
			beforeRun: new AsyncSeriesHook(["compiler"]), //运行前的准备活动，主要是启用了文件读取的功能
      run: new AsyncSeriesHook(["compiler"]),//跑起来了,在编译之前有缓存则启用缓存可以提高效率
      //编译前的准备，创建ModuleFactory并绑定到创建的Compilation上，同时处理一些不需要编译的模块
      beforeCompile: new AsyncSeriesHook(["params"]),
			compile: new SyncHook(["params"]),//编译
			make: new AsyncParallelHook(["compilation"]),//从Compilation的addEntry函数开始构建模块
      afterCompile: new AsyncSeriesHook(["compilation"]),//编译结束
      
      shouldEmit: new SyncBailHook(["compilation"]),//获取Compilation编译结果来看是不是可以输出了
			emit: new AsyncSeriesHook(["compilation"]),//输出文件
      afterEmit: new AsyncSeriesHook(["compilation"]),//输出完毕
      done: new AsyncSeriesHook(["stats"]),//无论成功与否一切尘埃落定

			thisCompilation: new SyncHook(["compilation", "params"]),
			compilation: new SyncHook(["compilation", "params"]),
			normalModuleFactory: new SyncHook(["normalModuleFactory"]),
			contextModuleFactory: new SyncHook(["contextModulefactory"]),
      additionalPass: new AsyncSeriesHook([]),
			
			watchRun: new AsyncSeriesHook(["compiler"]),
			failed: new SyncHook(["error"]),
			invalid: new SyncHook(["filename", "changeTime"]),
			watchClose: new SyncHook([]),

			environment: new SyncHook([]),
			afterEnvironment: new SyncHook([]),
			afterPlugins: new SyncHook(["compiler"]),
			afterResolvers: new SyncHook(["compiler"]),
			entryOption: new SyncBailHook(["context", "entry"])
		};

		this._pluginCompat.tap("Compiler", options => {
			switch (options.name) {
				case "additional-pass":
				case "before-run":
				case "run":
				case "emit":
				case "after-emit":
				case "before-compile":
				case "make":
				case "after-compile":
				case "watch-run":
					options.async = true;
					break;
			}
		});

		this.name = undefined;
		this.parentCompilation = undefined;
		this.outputPath = "";

		this.outputFileSystem = null;
		this.inputFileSystem = null;

		this.recordsInputPath = null;
		this.recordsOutputPath = null;
		this.records = {};
		this.removedFiles = new Set();
		this.fileTimestamps = new Map();
		this.contextTimestamps = new Map();
    this.resolverFactory = new ResolverFactory();
    
		this.resolvers = { //模块解析器，用来找模块
			normal: {
				plugins: util.deprecate((hook, fn) => {
					this.resolverFactory.plugin("resolver normal", resolver => {
						resolver.plugin(hook, fn);
					});
				}, "webpack: Using compiler.resolvers.normal is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver normal", resolver => {\n  resolver.plugin(/* … */);\n}); instead.'),
				apply: util.deprecate((...args) => {
					this.resolverFactory.plugin("resolver normal", resolver => {
						resolver.apply(...args);
					});
				}, "webpack: Using compiler.resolvers.normal is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver normal", resolver => {\n  resolver.apply(/* … */);\n}); instead.')
			},
			loader: {
				plugins: util.deprecate((hook, fn) => {
					this.resolverFactory.plugin("resolver loader", resolver => {
						resolver.plugin(hook, fn);
					});
				}, "webpack: Using compiler.resolvers.loader is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver loader", resolver => {\n  resolver.plugin(/* … */);\n}); instead.'),
				apply: util.deprecate((...args) => {
					this.resolverFactory.plugin("resolver loader", resolver => {
						resolver.apply(...args);
					});
				}, "webpack: Using compiler.resolvers.loader is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver loader", resolver => {\n  resolver.apply(/* … */);\n}); instead.')
			},
			context: {
				plugins: util.deprecate((hook, fn) => {
					this.resolverFactory.plugin("resolver context", resolver => {
						resolver.plugin(hook, fn);
					});
				}, "webpack: Using compiler.resolvers.context is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver context", resolver => {\n  resolver.plugin(/* … */);\n}); instead.'),
				apply: util.deprecate((...args) => {
					this.resolverFactory.plugin("resolver context", resolver => {
						resolver.apply(...args);
					});
				}, "webpack: Using compiler.resolvers.context is deprecated.\n" + 'Use compiler.resolverFactory.plugin("resolver context", resolver => {\n  resolver.apply(/* … */);\n}); instead.')
			}
		};

		this.options = /** @type {WebpackOptions} */ ({});

		this.context = context;

		this.requestShortener = new RequestShortener(context);

		this.running = false;

		this.watchMode = false;
	}

	watch(watchOptions, handler) {
		if (this.running) return handler(new ConcurrentCompilationError());

		this.running = true;
		this.watchMode = true;
		this.fileTimestamps = new Map();
		this.contextTimestamps = new Map();
		this.removedFiles = new Set();
		return new Watching(this, watchOptions, handler);
	}

	run(callback) {
		if (this.running) return callback(new ConcurrentCompilationError());

		const finalCallback = (err, stats) => {
			this.running = false;

			if (callback !== undefined) return callback(err, stats);
		};

		const startTime = Date.now();

		this.running = true;
// 当参数传入，在beforeRun最后调。功能是将编译后的内容生成文件
		const onCompiled = (err, compilation) => {
			if (err) return finalCallback(err);
      // 如果没有编译成功则done(结束)
			if (this.hooks.shouldEmit.call(compilation) === false) {
				const stats = new Stats(compilation);
				stats.startTime = startTime;
				stats.endTime = Date.now();
				this.hooks.done.callAsync(stats, err => {
					if (err) return finalCallback(err);
					return finalCallback(null, stats);
				});
				return;
			}
      // 成功则打包文件
			this.emitAssets(compilation, err => {
				if (err) return finalCallback(err);

				if (compilation.hooks.needAdditionalPass.call()) {
					compilation.needAdditionalPass = true;

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);

						this.hooks.additionalPass.callAsync(err => {
							if (err) return finalCallback(err);
							this.compile(onCompiled);
						});
					});
					return;
				}

				this.emitRecords(err => {
					if (err) return finalCallback(err);

					const stats = new Stats(compilation);
					stats.startTime = startTime;
					stats.endTime = Date.now();
					this.hooks.done.callAsync(stats, err => {
						if (err) return finalCallback(err);
						return finalCallback(null, stats);
					});
				});
			});
		};

		this.hooks.beforeRun.callAsync(this, err => {
			if (err) return finalCallback(err);

			this.hooks.run.callAsync(this, err => { //处理缓存模块内，减少编译模块，加快编译速度
				if (err) return finalCallback(err);

				this.readRecords(err => {
					if (err) return finalCallback(err);

					this.compile(onCompiled);
				});
			});
		});
  }
  // ...
	createCompilation() {
		return new Compilation(this);
	}

	newCompilation(params) {
		const compilation = this.createCompilation();
		compilation.fileTimestamps = this.fileTimestamps;
		compilation.contextTimestamps = this.contextTimestamps;
		compilation.name = this.name;
		compilation.records = this.records;
		compilation.compilationDependencies = params.compilationDependencies;
		this.hooks.thisCompilation.call(compilation, params);
		this.hooks.compilation.call(compilation, params);
		return compilation;
	}

	createNormalModuleFactory() {
		const normalModuleFactory = new NormalModuleFactory(
			this.options.context,
			this.resolverFactory,
			this.options.module || {}
		);
		this.hooks.normalModuleFactory.call(normalModuleFactory);
		return normalModuleFactory;
	}

	createContextModuleFactory() {
		const contextModuleFactory = new ContextModuleFactory(this.resolverFactory);
		this.hooks.contextModuleFactory.call(contextModuleFactory);
		return contextModuleFactory;
	}

	newCompilationParams() {
		const params = {
			normalModuleFactory: this.createNormalModuleFactory(),
			contextModuleFactory: this.createContextModuleFactory(),
			compilationDependencies: new Set()
		};
		return params;
	}

	compile(callback) {
    // 模块工厂，其中最常用的NormalModuleFactory。将这个工厂传入钩子中方便之后的插件或钩子操作模块
    const params = this.newCompilationParams();
    
		this.hooks.beforeCompile.callAsync(params, err => {
			if (err) return callback(err);
			this.hooks.compile.call(params);
      // 一次编译生成一个compilation
			const compilation = this.newCompilation(params);
      
			this.hooks.make.callAsync(compilation, err => {// 正式启动编译的钩子,分析入口文件，创建模块对象
				if (err) return callback(err);

				compilation.finish();

				compilation.seal(err => {
					if (err) return callback(err);

					this.hooks.afterCompile.callAsync(compilation, err => {
						if (err) return callback(err);

						return callback(null, compilation);
					});
				});
			});
		});
	}
}

module.exports = Compiler;
