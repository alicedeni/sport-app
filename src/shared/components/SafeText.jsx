import React from 'react'
import { sanitizeText, sanitizeName } from '@shared/utils/sanitize'
const SafeText = ({ text, className = '', preserveLineBreaks = true }) => {
  if (!text) return null

  const sanitized = preserveLineBreaks ? sanitizeText(text) : sanitizeName(text)

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />
}

export const SafeName = ({ name, className = '' }) => {
  if (!name) return null

  const sanitized = sanitizeName(name)

  return <span className={className}>{sanitized}</span>
}

export default SafeText
