<template>
    <div class="Electron-Operation" v-if="isElectron">
        <i class="iconfont icon-close-bold" @click="operationEvent('setSkipTaskbar')"></i>
        <i class="iconfont icon-max-window" @click="operationEvent('window-max')"></i>
        <i class="iconfont icon-minus" @click="operationEvent('window-min')"></i>
    </div>
</template>

<script>
const isElectron = navigator.userAgent.indexOf('Electron') !== -1
let electron
if (isElectron) {
    electron = eval('require("electron")')
    window.openlink = function (href) {
        electron.shell.openExternal(href)
    }
}
export default {
  name: 'Electron-Operation',
  props: {
  },
  data () {
    return {
        isElectron: isElectron
    }
  },
  mounted () {
    if (isElectron) {
        // 刷新
        electron.ipcRenderer.on('reload', function(event, text) {
            window.location.reload()
        })
        document.body.addEventListener('mouseup', function (event) {
            if (event.button === 2) {
                electron.ipcRenderer.send('sigShowRightClickMenu')
            }
        }, false)
    }
  },
  methods: {
    operationEvent (eventName) {
        electron.ipcRenderer.send('window-mainsys', eventName)
    }
  }
}
</script>

<style lang="less" rel="stylesheet/less" scoped>
.Electron-Operation{
    width: 120px;
    height: 100%;
    float: right;
    position: relative;
    border-left: 1px rgba(223,226,228,1) solid;
    .icon-close-bold{
        display: block;
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 12px;
        cursor: pointer;
        color: #909399;
    }
    .icon-max-window{
        display: block;
        position: absolute;
        right: 45px;
        top: 20px;
        font-size: 12px;
        cursor: pointer;
        color: #909399;
    }
    .icon-minus{
        display: block;
        position: absolute;
        left: 20px;
        top: 20px;
        font-size: 12px;
        cursor: pointer;
        color: #909399;
    }
}
</style>
