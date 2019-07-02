// 定义的函数里引用里this导致内存泄漏
this.instance.commands['insertfield'] = {
    execCommand: () => {
        if (!this.closeInsertField) {
            this.$refs.dialogField.isOpen(this.instance) // 选模块字段
        }
        this.$emit('clickInsertField')
        return true
    }
}
this.instance.commands['inserttext'] = {
    execCommand: () => {
        if (!this.closeInsertField) {
            this.$refs.dialogText.isOpen(this.instance, 2) // 文本
        }
        this.$emit('clickInsertField')
        return true
    }
}
