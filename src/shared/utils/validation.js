/**
 * Валидация email адреса
 * @param {string} email - email для проверки
 * @returns {boolean} true если email валидный
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Валидация пароля
 * @param {string} password - пароль для проверки
 * @returns {object} объект с результатами валидации
 */
export const validatePassword = (password) => {
  const minLength = password.length >= 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    errors: {
      minLength: !minLength ? 'Пароль должен содержать минимум 8 символов' : null,
      hasUpperCase: !hasUpperCase ? 'Пароль должен содержать заглавные буквы' : null,
      hasLowerCase: !hasLowerCase ? 'Пароль должен содержать строчные буквы' : null,
      hasNumbers: !hasNumbers ? 'Пароль должен содержать цифры' : null,
      hasSpecialChar: !hasSpecialChar ? 'Пароль должен содержать специальные символы' : null,
    }
  }
}

/**
 * Валидация имени пользователя
 * @param {string} name - имя для проверки
 * @returns {boolean} true если имя валидное
 */
export const validateName = (name) => {
  return name.trim().length >= 2 && name.trim().length <= 50
}
