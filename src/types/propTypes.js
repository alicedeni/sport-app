import PropTypes from 'prop-types'

export const commonPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
}

export const userPropTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  points: PropTypes.number,
  goal: PropTypes.number,
  teams: PropTypes.number,
  participants: PropTypes.number,
  count: PropTypes.number,
  showWelcome: PropTypes.bool,
}

export const navigationPropTypes = {
  currentPage: PropTypes.oneOf(['feed', 'challenges', 'ratings', 'activity']),
  onNavigate: PropTypes.func,
}

export const modalPropTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
}

