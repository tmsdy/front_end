// 1.选择联系人确认
comfirmSelect = () => {
    let { contactList } = this.state
    navUtil.navigation.setParams({ contactList: contactList.filter(item => item.select) || [] })
    setTimeout(() => {
        navUtil.navigation.dispatch(StackActions.pop({ n: 2 }))
    });
}
// 2.选择文件确认
navUtil.navigation.setParams({ fileList: fileParams })
setTimeout(() => {
    navUtil.navigation.dispatch(StackActions.pop({ n: 1 }))
});

// 3.写邮件页的监听
let Nav = this.props.navigation
this.navListener = Nav.addListener('willFocus', payload => {
    let action = payload.action
    let contactList = navUtil.navigation.getParam('contactList')
    let fileList = navUtil.navigation.getParam('fileList')
    let currentType = this.props.navigation.getParam('currentType')
    // console.log('willFocus', payload)
    if (action.type === 'Navigation/POP' && action.n === 2 && contactList && currentType) {
        if (contactList.length) {
            contactList = contactList.map(item => item.mailAddress)
            switch (currentType) {
                case 'to': this.setState({ currentInputType: 0 }); break;
                case 'cc': this.setState({ currentInputType: 1 }); break;
                case 'bcc': this.setState({ currentInputType: 2 }); break;
            }
            setTimeout(() => {
                this.contactsCheck(contactList)
                navUtil.navigation.setParams({ contactList: [] })
            }, 0);
        }
    }
    if (action.type === 'Navigation/POP' && action.n === 1 && fileList) {
        if (fileList.length) {
            this.folders_moveFiles('new', fileList)
            navUtil.navigation.setParams({ fileList: [] })
        }
    }
})
componentWillUnmount() {
    this.navListener && this.navListener.remove()
}