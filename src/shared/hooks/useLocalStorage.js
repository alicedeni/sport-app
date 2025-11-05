import { useState, useEffect } from 'react'
import logger from '@shared/utils/logger'

/**
 * Хук для работы с localStorage
 * @param {string} key - ключ в localStorage
 * @param {any} initialValue - начальное значение
 * @returns {[any, function]} [value, setValue] - значение и функция для его изменения
 */
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      logger.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      logger.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
