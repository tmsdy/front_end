import '../assets/styles/footer.styl'

export default {
    data() {
        return {
            author: "marin1993"
        }
    },
    created() {
        this.test1 = 'test1' // 可以赋值data上没有的的值
    },
    beforeMount() {
        this.test2 = 'test2' // 可以
    },
    mounted() {
        console.log('mounted')
        this.$nextTick(() => {
            this.test3 = 'test3' // 不行
            this.test1 = 'test2222' // 竟然改不了
        })
    },
    render() {
        return (
            <div id="footer">
                <span>Power by {this.author} {this.test1}{this.test2}{this.test3}</span>
            </div>
        )
    }
}