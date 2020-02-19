/*
问题：

<WebView
    style={{ flex: 1 }}
    ref='webView'
    bounces={true}
    allowFileAccess={true}
    useWebKit={true}
    domStorageEnabled={true}
    injectedJavaScript={jsStr}
    mixedContentMode="always" // Webview里面的http的图片加载不出来要设置这个
    onNavigationStateChange={e => {this.onNavigationStateChange(e)}}
    onMessage={e => {
        this.onMessage(JSON.parse(e.nativeEvent.data))
    }}
    source={{ uri: this.state.url }}
    />

*/