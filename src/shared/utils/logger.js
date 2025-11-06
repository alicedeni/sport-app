export const isDev = typeof import.meta !== 'undefined' ? !!import.meta.env?.DEV : false

const noop = () => {}

const shouldSuppressUnauthorized = (args) => {
  try {
    for (const a of args) {
      if (a && typeof a === 'object') {
        const resp = a.response || a?.config?.response
        if (resp && resp.status === 401) return true
        if ('status' in a && a.status === 401) return true
        if (typeof a === 'string' && (/unauthorized/i.test(a) || /401/.test(a))) return true
      }
    }
  } catch {}
  return false
}

const logger = {
  log: isDev ? console.log.bind(console) : noop,
  info: isDev ? console.info?.bind(console) || console.log.bind(console) : noop,
  debug: isDev ? console.debug?.bind(console) || console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: (...args) => {
    if (!isDev) return
    if (shouldSuppressUnauthorized(args)) return
    console.error(...args)
  },
}

export default logger
