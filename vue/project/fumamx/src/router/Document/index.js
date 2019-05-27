export default {
  path: 'document',
  name: 'Document',
  component: () => import ('@/page/Main/Document/index.vue'),
  children: [
    {// 文档搜索
      path: 'search',
      name: 'Search',
      component: () => import ('@/page/Main/Document/Search/index.vue')
    },
    {// 我的文档
      path: 'my',
      name: 'My',
      component: () => import ('@/page/Main/Document/My/index.vue')
    },
    {// 知识库
      path: 'knowledgebase',
      name: 'KnowledgeBase',
      component: () => import ('@/page/Main/Document/KnowledgeBase/index.vue')
    },
    {// 删除文件
      path: 'deletefile',
      name: 'DeleteFile',
      component: () => import ('@/page/Main/Document/DeleteFile/index.vue')
    }
  ]
}
