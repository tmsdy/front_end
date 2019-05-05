/**
 * redux工具集
 * Created by xushichao on 2018-12-28.
 */

export default {
  createSimpleAction(type: string, ...argNames: any[]) {
    return (...args) => {
      return argNames.reduce((action, name, i) => {
        action[name] = args[i]; // eslint-disable-line no-param-reassign
        return action;
      }, {type});
    };
  },

  createReducer(initialState = {}, actionsMap = {}) {
    return (state = initialState, action) => {
      const reduceFn = actionsMap[action.type];
      if(!reduceFn) return state;
      return reduceFn(state, action);
    };
  },

  createRef() {
    const refObject = {
      current: null,
      getInstance: () => {
        if(refObject.current) {
          let ref = refObject.current.getWrappedInstance ? refObject.current.getWrappedInstance() : refObject.current;
          return Promise.resolve(ref);
        }
        return Promise.reject();
      }
    };
    Object.seal(refObject);
    return refObject;
  },
};
