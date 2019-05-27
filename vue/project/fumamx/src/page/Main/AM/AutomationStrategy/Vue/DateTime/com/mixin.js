export default {
    methods: {
        completion(i) {
            return (i < 10 ? '0' : '') + i
        },
        dateFormat(time, format) {
            var t = time ? new Date(time) : new Date()

            var tf = function(i) {
                return (i < 10 ? '0' : '') + i
            }
            let a = format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                    case 'yyyy':
                        return tf(t.getFullYear())
                        break
                    case 'MM':
                        return tf(t.getMonth() + 1)
                        break
                    case 'mm':
                        return tf(t.getMinutes())
                        break
                    case 'dd':
                        return tf(t.getDate())
                        break
                    case 'HH':
                        return tf(t.getHours())
                        break
                    case 'ss':
                        return tf(t.getSeconds())
                        break
                }
            })

            return a
        },
        getWholeDate(date) {
            if (!date) {
                return this.dateFormat(null, 'yyyy/MM/dd HH:mm:ss')
            }
            /* yyyy-MM-dd HH:mm:ss */
            if (/\d{4}(-\d{2}){2} \d{2}(:\d{2}){2}/.test(date)) {
                return date
            }

            /* yyyy-MM-dd HH:mm */
            if (/\d{4}(-\d{2}){2} \d{2}(:\d{2}){1}/.test(date)) {
                return date + ':00'
            }
            /* MM-dd HH:mm:ss */
            if (/\d{2}-\d{2} \d{2}(:\d{2}){2}/.test(date)) {
                return this.dateFormat(null, 'yyyy') + '-' + date
            }
            /* MM-dd HH:mm */
            if (/\d{2}-\d{2} \d{2}(:\d{2}){1}/.test(date)) {
                return this.dateFormat(null, 'yyyy') + '-' + date + ':00'
            }
            /* dd HH:mm:ss */
            if (/\d{2} \d{2}(:\d{2}){2}/.test(date)) {
                return this.dateFormat(null, 'yyyy-MM') + '-' + date
            }
            /* dd HH:mm */
            if (/\d{2} \d{2}(:\d{2}){1}/.test(date)) {
                return this.dateFormat(null, 'yyyy-MM') + '-' + date + ':00'
            }
            /* HH:mm:ss */
            if (/\d{2}(:\d{2}){2}/.test(date)) {
                return this.dateFormat(null, 'yyyy-MM-dd') + ' ' + date
            }
            /* HH:mm */
            if (/\d{2}(:\d{2}){1}/.test(date)) {
                return this.dateFormat(null, 'yyyy-MM-dd') + ' ' + date + ':00'
            }
        }
    }
}
