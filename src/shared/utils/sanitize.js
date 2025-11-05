/**
 * Экранирует HTML-символы в строке
 * @param {string} text - Текст для экранирования
 * @returns {string} - Экранированный текст
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') {
    return ''
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }

  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Безопасно выводит текст с сохранением переносов строк
 * @param {string} text - Текст для вывода
 * @returns {string} - Безопасный HTML с переносами строк
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') {
    return ''
  }
  const escaped = escapeHtml(text)
  return escaped.replace(/\n/g, '<br>')
}

/**
 * Безопасно выводит имя пользователя (только экранирование, без переносов)
 * @param {string} name - Имя пользователя
 * @returns {string} - Экранированное имя
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return ''
  }
  return escapeHtml(name)
}
