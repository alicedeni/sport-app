const format = (date, formatString) => {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Неверная дата'

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  return formatString.replace('dd', day).replace('MM', month).replace('yyyy', year)
}

const parseISO = (dateString) => new Date(dateString)
const isValid = (date) => !isNaN(date.getTime())

/**
 * Форматирует дату в читаемый вид
 * @param {string|Date} date - дата в формате ISO или Date объект
 * @param {string} formatString - строка формата (по умолчанию 'dd.MM.yyyy')
 * @returns {string} отформатированная дата
 */

export const formatDate = (date, formatString = 'dd.MM.yyyy') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) {
      return 'Неверная дата'
    }
    return format(dateObj, formatString, { locale: ru })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Неверная дата'
  }
}

/**
 * Форматирует время в читаемый вид
 * @param {number} minutes - количество минут
 * @returns {string} отформатированное время (например, "1ч 30м")
 */
export const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}м`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}ч`
  }

  return `${hours}ч ${remainingMinutes}м`
}

/**
 * Форматирует расстояние
 * @param {number} meters - расстояние в метрах
 * @returns {string} отформатированное расстояние (например, "1.5 км")
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters}м`
  }

  const kilometers = meters / 1000
  return `${kilometers.toFixed(1)} км`
}
