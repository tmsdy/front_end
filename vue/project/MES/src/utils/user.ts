import localStore from '@/utils/storage/local'
import sessionStore from '@/utils/storage/session'
import c from '@/config'

function setAutologin(val: boolean) {
  localStore.set(c.AUTO_LOGIN, val)
}

function getAutologin(): boolean {
  return localStore.get(c.AUTO_LOGIN) || false
}

function setToken(token: string, expire: Date) {
  if (getAutologin()) {
    // store token in local
    // @ts-ignore
    localStore.set(c.TOKEN, token, expire.getTime())
  } else {
    // store token in session
    // @ts-ignore
    sessionStore.set(c.TOKEN, token, expire.getTime())
  }
}

function getToken(): string {
  let token = ''
  if (getAutologin()) {
    // store token in local
    token = localStore.get(c.TOKEN) || ''
  } else {
    // store token in session
    token = sessionStore.get(c.TOKEN)
  }
  return token
}

function removeToken() {
  localStore.remove(c.TOKEN)
  sessionStore.remove(c.TOKEN)
}

function logout() {
  removeToken()
}

function getInfo() {
  const token = getToken()
  if (token) {
    return JSON.parse(window.atob(token.split('.')[1] || ''))
  } else {
    return {}
  }
}

export default {
  set autologin(val: boolean) {
    setAutologin(val)
  },
  get autologin() {
    return getAutologin()
  },
  setToken,
  getToken,
  removeToken,
  logout,
  getInfo,
}
