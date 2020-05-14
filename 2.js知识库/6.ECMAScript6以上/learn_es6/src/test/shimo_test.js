import moment from 'moment'

let date = ['20200507', '20200513']
console.log(
  moment(date[0]).format('YYYY-MM-DD'),
  moment(date[1]).format('YYYY-MM-DD'),
  moment(date[1]).diff(moment(date[0]), 'day') + 1
)
