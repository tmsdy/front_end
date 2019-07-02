// 由window.PinyinHelper window.PinyinFormat引起的内存泄漏
export const toPinyin = (data = [], _option = {}) => {
    let option = Object.assign({
            usekey: 'label'
        },
        _option
    )
    let {
        usekey
    } = option
    data.forEach(element => {
        element.alias =
            element[usekey] +
            ',' +
            PinyinHelper.convertToPinyinString(
                element[usekey],
                '',
                PinyinFormat.WITHOUT_TONE
            ) +
            ',' +
            PinyinHelper.convertToPinyinString(
                element[usekey],
                '',
                PinyinFormat.FIRST_LETTER
            )
    })
    return data
}

{
    alias: "付妍,fuyan,fy"
    ctId: 260815373
    inUse: 1
    mobile: "18550935584"
    nickName: "fy"
    realName: "付妍"
} {
    alias: "付妍,fuyan,fy"
    ctId: 260815373
    inUse: 1
    mobile: "18550935584"
    nickName: "fy"
    realName: "付妍"
}
