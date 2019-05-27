function calcDateOptions() {
    let dateOptions = []
    let time = new Date()
    let thisYear = time.getFullYear()
    let mouth = time.getMonth() + 1

    let thisMouth = getStr(mouth)

    let thisDay = getStr(time.getDate())

    function getStr(num) {
        return num < 10 ? '0' + num : num
    }

    function getBeforeYear(before) {
        let isEndMonth = mouth == 12

        let nmouth = isEndMonth ? 1 : mouth + 1
        let nextMouth = getStr(nmouth)

        let newBefore = isEndMonth ? before - 1 : before
        let year = thisYear - newBefore
        return `${year}-${nextMouth}-01`
    }

    let strToday = `${thisYear}-${thisMouth}-${thisDay}`

    dateOptions.push({ label: '最近24个月', bdate: getBeforeYear(2), edate: strToday })
    dateOptions.push({ label: '最近12个月', bdate: getBeforeYear(1), edate: strToday })

    for (let index = 0; index < 4; index++) {
        let showYear = thisYear - index
        let edate = thisYear == showYear ? strToday : `${showYear}-12-31`
        dateOptions.push({ label: `${showYear}年`, bdate: `${showYear}-01-01`, edate })
    }
    return dateOptions
}

function sortContacts(contacts = []) {
    for (let i = 0; i < contacts.length - 1; i++) {
        for (let j = i + 1; j < contacts.length; j++) {
            const item = contacts[i]
            const nextItem = contacts[j]
            let thisW = getWeight(item)
            let nextW = getWeight(nextItem)
            if (nextW > thisW) {
                contacts[i] = nextItem
                contacts[j] = item
                continue
            }
            if (nextW == thisW && nextItem.email.length < item.email.length) {
                contacts[i] = nextItem
                contacts[j] = item
            }
        }
    }

    function getWeight(item) {
        let keys = ['Facebook', 'Twitter', 'LinkedIn']
        let w = 0
        keys.forEach(key => {
            if (item.hasOwnProperty(key)) {
                w++
            }
            if (item.hasOwnProperty('fumaFlag')) {
                w += 4
            }
        })
        return w
    }
    return contacts
}

export {
    calcDateOptions,
    sortContacts
}
