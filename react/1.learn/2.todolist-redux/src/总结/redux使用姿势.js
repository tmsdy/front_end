/*
* todo.js
触发事件：store.dispatch(getAddTodoItemAction)
取值：store.getState()
订阅变化：store.subscribe(()=>{ this.setState(store.getState()) })

* actionCreators.js
定义actions：export const getAddTodoItemAction = (inputValue, count) => ({
    type: ADD_TODO_ITEM,
    count: ++count
})

* reducer.js
改变数据：根据确定的action返回确定的新state




*/