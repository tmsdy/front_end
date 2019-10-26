var posts = [
    { id: 11, title: "Node.js" },
    { id: 23, title: "React.js" }
]
var comment = {
    postId: 23,
    content: "Hello world!"
};
function postForComment(posts, comment) {
    return posts.find((post) => post.id === comment.postId)
}
console.log(postForComment(posts, comment))

let index = posts.findIndex(item => item.id == 23)
console.log(index)

console.log(posts.find(item => item.id === 1))