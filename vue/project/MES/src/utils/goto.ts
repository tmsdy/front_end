export default function goto(path: string) {
  if (path.startsWith('./')) {
    // relative path
  } else if (path.startsWith('/')) {
    // absolute path
    const { pathname, search } = window.location
    if (pathname + search === path) return
  } else {
    // full path
    if (window.location.href === path) return
  }
  window.location.href = path
}
