import logger from './logger'

/**
 * Проверяет успешность API ответа
 * @param {Object} response - ответ от API
 * @returns {boolean} - true если статус 200
 */
export const isSuccessResponse = (response) => {
  return response?.data?.status === 200
}

/**
 * Обрабатывает успешный API ответ
 * @param {Object} response - ответ от API
 * @param {Function} onSuccess - функция для успешного случая
 * @param {Function} onError - функция для ошибки (опционально)
 */
export const handleApiResponse = (response, onSuccess, onError) => {
  if (isSuccessResponse(response)) {
    onSuccess(response.data)
  } else {
    const errorMessage = response?.data?.message || 'Unknown error'
    if (onError) {
      onError(errorMessage)
    } else {
      logger.error('API Error:', errorMessage)
    }
  }
}

/**
 * Обрабатывает ошибку API запроса
 * @param {Error} error - ошибка
 * @param {Function} onError - функция для обработки ошибки (опционально)
 */
export const handleApiError = (error, onError) => {
  const errorMessage = error instanceof Error ? error.message : 'An error occurred'
  if (onError) {
    onError(errorMessage)
  } else {
    logger.error('API Error:', errorMessage)
  }
}

/**
 * Создает обработчик для API запроса с автоматической проверкой статуса
 * @param {Function} onSuccess - функция для успешного случая
 * @param {Function} onError - функция для ошибки (опционально)
 * @returns {Function} - обработчик для .then()
 */
export const createApiHandler = (onSuccess, onError) => {
  return (response) => {
    handleApiResponse(response, onSuccess, onError)
  }
}

