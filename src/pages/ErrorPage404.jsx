import { useRouteError } from 'react-router-dom'
import logger from '@shared/utils/logger'

export default function ErrorPage404() {
  const error = useRouteError()
  logger.error(error)

  return (
    <div id="error-page">
      <h1>Oops! Page not found...</h1>
    </div>
  )
}
