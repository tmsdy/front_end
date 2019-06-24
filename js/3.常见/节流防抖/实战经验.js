/*

1.window.addEventListener('resize', debounce(this.getScale, 500));
给window的resize事件加防抖是不对的
用window.removeEventListener('resize', this.getScale)清不掉这个

*/