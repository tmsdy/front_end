import '../assets/styles/footer.less'

export default{
    data(){
        return{
            author:"White Shark"
        }
    },
    render(){
      // jsx 里面这模板支持js写法，所以很灵活，适合非常复杂的场景
        return (
            <div id="footer">
                <span>Power by {this.author}</span>
            </div>
        )
    }
}