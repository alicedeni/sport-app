/**
 * Debounce функция для оптимизации производительности
 * @param {function} func - функция для debounce
 * @param {number} wait - время ожидания в миллисекундах
 * @returns {function} debounced функция
 */
export const debounce = (func, wait) => {
  let timeout = null

  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle функция для ограничения частоты вызовов
 * @param {function} func - функция для throttle
 * @param {number} limit - лимит времени в миллисекундах
 * @returns {function} throttled функция
 */
export const throttle = (func, limit) => {
  let inThrottle = false

  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Функция для объединения CSS классов
 * @param {...any} classes - классы для объединения
 * @returns {string} объединенная строка классов
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
