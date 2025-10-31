export { getDeclension } from '@shared/utils/declension.js'
export { getInitials, getAvatarBorderRadius, getProgressBarBorderRadius } from '@shared/utils/avatar.js'
export { formatDate, formatTime, formatDistance } from '@shared/utils/date.js'
export { validateEmail, validatePassword, validateName } from '@shared/utils/validation.js'
export { debounce, throttle, cn } from '@shared/utils/performance.js'
export {
  formatDateToInput,
  parseTimeToMinutes,
  formatMinutesToHours,
  getParticipantsText,
} from '@shared/utils/activity.js'

export {
  isSuccessResponse,
  handleApiResponse,
  handleApiError,
  createApiHandler,
} from '@shared/utils/apiResponse.js'
