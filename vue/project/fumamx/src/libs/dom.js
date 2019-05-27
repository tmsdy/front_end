/*
 * Discription:
 * -----
 * Created Date: 2019-04-28 06:03:45
 * Author: 郭兵 (guobing93@163.com)
 * -----
 * Last Modified: 2019-04-29 11:04:17
 * Modified By: name (email)
 */

import { ArraySpliceOne } from './utils'

export const getRect = function(el) {
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect()
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        }
    } else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        }
    }
}

/**
 * 监听dom变化
 */
export const DomObserver = (function() {
    function _DomObserver (el) {
        this.destoryed = false
        this.el = el
        this._events = {}
        this._initDOMObserver(el)
    }
    _DomObserver.prototype._initDOMObserver = function() {
        if (typeof MutationObserver !== 'undefined') {
            let timer
            let observer = new MutationObserver(mutations => {
                let immeditateRefresh = false
                let deferredRefresh = false
                for (let index = 0; index < mutations.length; index++) {
                    const mutation = mutations[index]
                    if (mutation.type !== 'attributes') {
                        immeditateRefresh = true
                        break
                    } else {
                        if (mutation.target !== this.el) {
                            deferredRefresh = true
                            break
                        }
                    }
                }
                if (immeditateRefresh) {
                    this.trigger('refresh')
                } else if (deferredRefresh) {
                    clearTimeout(timer)
                    timer = setTimeout(() => {
                        this.trigger('refresh')
                    }, 60)
                }
            })
            observer.observe(this.el, {
                'childList': true,
                'attributes': true,
                'subtree': true
            })
            this.on('destory', () => {
                observer.disconnect()
            })
        } else {
            this._checkDOMUpdate()
        }
    }
    _DomObserver.prototype._checkDOMUpdate = function() {
        let rect = getRect(this.el)
        let oldWidth = rect.width
        let oldHeight = rect.height

        function check () {
            if (this.destoryed) { return }
            let rect2 = getRect(this.el)
            let newWidth = rect2.width
            let newHeight = rect2.height
            if (newWidth !== oldWidth || newHeight !== oldHeight) {
                this.trigger('refresh')
            }
            oldHeight = newHeight
            oldWidth = newWidth
            next.call(this)
        }

        function next () {
            setTimeout(() => {
                check.call(this)
            }, 1000)
        }
        next.call(this)
    }

    _DomObserver.prototype.on = function(type, fn, ctx = this) {
        if (!this._events[type]) {
            this._events[type] = []
        }
        this._events[type].push([fn, ctx])
    }
    _DomObserver.prototype.off = function(type, fn) {
        let events = this._events[type]
        if (!events) return
        let len = events.length
        while (len--) {
            if (events[len][0] === fn || (events[len][0] && events[len][0].fn === fn)) {
                ArraySpliceOne(events, len)
            }
        }
    }
    _DomObserver.prototype.trigger = function(type) {
        let events = this._events[type]
        if (!events) { return }
        let len = events.length
        let copyEvents = [...events]
        for (let index = 0; index < len; index++) {
            let event = copyEvents[index]
            let [fn, ctx] = event
            if (fn) {
                fn.apply(ctx, [].slice.call(arguments, 1))
            }
        }
    }
    _DomObserver.prototype.destory = function() {
        this.trigger('destory')
        this.destoryed = true
    }

    return _DomObserver
}())
