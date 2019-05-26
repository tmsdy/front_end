class NodeEnvironmentPlugin {
	apply(compiler) {
		/*
		 解析文件(resolver)时一定会用到文件系统，如何读取文件
		把inputFileSystem挂在compiler上，然后通过compiler来控制哪些插件需要这个功能，就派发给谁
		 */
		compiler.inputFileSystem = new CachedInputFileSystem( //输入文件系统
			new NodeJsInputFileSystem(),
			60000
		);
		const inputFileSystem = compiler.inputFileSystem;
		compiler.outputFileSystem = new NodeOutputFileSystem(); //输出文件系统
		compiler.watchFileSystem = new NodeWatchFileSystem( //监测文件系统
			compiler.inputFileSystem
		);
		compiler.hooks.beforeRun.tap("NodeEnvironmentPlugin", compiler => { //注册事件
			if (compiler.inputFileSystem === inputFileSystem) inputFileSystem.purge();
		});
	}
}