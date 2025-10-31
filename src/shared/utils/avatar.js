/**
 * Получает первую букву имени для аватара по умолчанию
 * @param {string} name - имя пользователя
 * @returns {string} - первая буква имени
 */
export const getInitials = (name) => {
  return name ? name.charAt(0).toUpperCase() : ''
}

/**
 * Определяет стиль border-radius для аватара в зависимости от прогресса цели
 * @param {number} goal - процент выполнения цели
 * @returns {string} - значение border-radius
 */
export const getAvatarBorderRadius = (goal) => {
  return goal > 0 && goal < 5 ? '50%' : '28px'
}

/**
 * Определяет стиль border-radius для полосы прогресса в зависимости от значения
 * @param {number} goal - процент выполнения цели
 * @param {boolean} isMobile - мобильная версия или нет
 * @returns {string} - значение border-radius
 */
export const getProgressBarBorderRadius = (goal, isMobile = false) => {
  const baseRadius = isMobile ? 14 : 28

  if (goal <= 0) {
    return '0px'
  } else if (goal < 8) {
    return `${baseRadius}px 0 0 ${baseRadius}px`
  } else {
    return `${baseRadius}px`
  }
}
