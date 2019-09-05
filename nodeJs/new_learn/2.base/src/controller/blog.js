const getList = (author, keyword) => {
    // 先返回假数据
    return [
        {
            id: 1,
            title: '标题1',
            content: '内容1',
            createTime: 1567589531523,
            author: 'feifei'
        },
        {
            id: 1,
            title: '标题2',
            content: '内容2',
            createTime: 1567589533452,
            author: 'fangfang'
        },
    ]
}

const getDetail = (id) => {
    return {
        id: 1,
        title: '标题1',
        content: '内容1',
        createTime: 1567589531523,
        author: 'feifei'
    }
}

const newBlog = (blogData = {}) => {
    console.log('newblog:', blogData)
    return {
        id: 3
    }
}

const updateBlog = (id, blogData = {}) => {
    console.log('update blog: ', id, blogData)
    return true
}

const deleteBlog = (id) => {
    console.log('delete blog: ', id)
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}