
// 1.路由重置到写邮件，且上一个路由变成Test
navUtil.navigation.dispatch(StackActions.reset({
    index: 1,
    actions: [
        NavigationActions.navigate({ routeName: 'Test' }),
        NavigationActions.navigate({ routeName: 'WriteMail', params: { actionType: 'FileMail', fileList: fileParams } })
    ],
}))

// 2.路由replace
// 选文件返回（跳1层路由）
navUtil.navigation.dispatch(StackActions.pop({ n: 1 })) // 干掉之前的WriteMail路由
navUtil.navigation.dispatch(StackActions.replace({ // 替换掉当前最上层的路由
    routeName: 'WriteMail',
    params: {
        actionType: 'FileMail',
        fileList: fileParams
    }
}))
// 选联系人返回（跳2层路由）
navUtil.navigation.dispatch(StackActions.pop({ n: 2 }))
navUtil.navigation.dispatch(StackActions.replace({
    routeName: 'WriteMail',
    params: {} //要传，不然还报错
}))