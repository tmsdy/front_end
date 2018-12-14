import Moment from 'moment'

export function getTimeRange(
  date: Date,
  days: number,
): { startDate: Date; endDate: Date } {
  const targetDate = Moment(date)
  const currentDate = Moment()

  if (targetDate.isAfter(currentDate, 'days')) {
    return {
      startDate: Moment(currentDate)
        .subtract(days, 'days')
        .toDate(),
      endDate: new Date(),
    }
  } else {
    if (
      Moment(targetDate)
        .add(Math.ceil(days / 2), 'days')
        .isBefore(currentDate, 'days')
    ) {
      const endDate = Moment(targetDate).add(Math.ceil(days / 2), 'days')
      const startDate = Moment(endDate).subtract(days, 'days')
      return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      }
    } else {
      return {
        startDate: Moment(currentDate)
          .subtract(days, 'days')
          .toDate(),
        endDate: currentDate.toDate(),
      }
    }
  }
}
