import { useState, useEffect } from 'react'
import api from '@shared/services/api.js'

/**
 * Универсальный хук для API запросов
 * @param {string} url - URL для запроса
 * @param {object} options - опции запроса
 * @returns {object} { data, loading, error, refetch }
 */
export const useApi = (url, options) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api(url, options)
      setData(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch }
}
