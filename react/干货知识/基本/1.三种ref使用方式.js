// 详细链接：https://juejin.im/post/5b59287af265da0f601317e3
/*
string ref
缺点：
    当 ref 定义为 string 时，需要 React 追踪当前正在渲染的组件，在 reconciliation 阶段，React Element 创建和更新的过程中，
    ref 会被封装为一个闭包函数，等待 commit 阶段被执行，这会对 React 的性能产生一些影响。
*/
class MyComponent extends React.Component {
    componentDidMount() {
        this.refs.myRef.focus();
    }
    render() {
        return <input ref="myRef" />;
    }
}

// callback ref
class MyComponent extends React.Component {
    componentDidMount() {
        this.myRef.focus();
    }
    render() {
        return <input ref={(ele) => {
            this.myRef = ele;
        }} />;
    }
}

// React.createRef
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }
    componentDidMount() {
        this.myRef.current.focus();
    }
    render() {
        return <input ref={this.myRef} />;
    }
}
