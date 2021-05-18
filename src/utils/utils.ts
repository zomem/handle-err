export const getTime = (type: 'date' | 'date_time' | 'stamp', stamp?: number) => {
  let nowTime = stamp ? new Date(stamp) : new Date()

  let Y = nowTime.getFullYear()
  let M = nowTime.getMonth() + 1 < 10 ? '0' + (nowTime.getMonth() + 1) : (nowTime.getMonth() + 1)
  let D = nowTime.getDate() < 10 ? '0' + nowTime.getDate() : nowTime.getDate()
  let h = nowTime.getHours() < 10 ? '0' + nowTime.getHours() : nowTime.getHours()
  let m = nowTime.getMinutes() < 10 ? '0' + nowTime.getMinutes() : nowTime.getMinutes()
  let s = nowTime.getSeconds() < 10 ? '0' + nowTime.getSeconds() : nowTime.getSeconds()

  switch (type) {
    case 'date':
      return `${Y}-${M}-${D}`
    case 'date_time':
      return `${Y}-${M}-${D} ${h}:${m}:${s}`
    case 'stamp':
      return nowTime.getTime()
    default:
      return nowTime.getTime()
  }
}