export const setCookie = (NameOfCookie, value, expiredays) => {
  const ExpireDate = new Date()
  ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000))

  document.cookie = NameOfCookie + "=" + encodeURIComponent(value) + ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString())
}

export const getCookie = NameOfCookie => {
  if (document.cookie.length > 0) {
    let begin = document.cookie.indexOf(NameOfCookie + "=")
    if (begin != -1) {
      begin += NameOfCookie.length + 1
      let end = document.cookie.indexOf(";", begin)
      if (end == -1) end = document.cookie.length
      return decodeURIComponent(document.cookie.substring(begin, end))
    }
  }
  return null
}

export const delCookie = NameOfCookie => {
  if (getCookie(NameOfCookie)) {
    document.cookie = NameOfCookie + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT"
  }
}
