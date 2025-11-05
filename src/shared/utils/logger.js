export const isDev = typeof import.meta !== 'undefined' ? !!import.meta.env?.DEV : false

const noop = () => {}

const logger = {
  log: isDev ? console.log.bind(console) : noop,
  info: isDev ? console.info?.bind(console) || console.log.bind(console) : noop,
  debug: isDev ? console.debug?.bind(console) || console.log.bind(console) : noop,
  warn: isDev ? console.warn.bind(console) : noop,
  error: isDev ? console.error.bind(console) : noop,
}

export default logger
