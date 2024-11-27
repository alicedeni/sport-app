import React from 'react'
import { useNavigate } from 'react-router-dom'

export function ButtonEnter({ src, onClick, textContent }) {
  return (
    <a className="welcome-block__link-forward" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}
export function ButtonNext({ src, onClick, textContent }) {
  return (
    <a className="welcome-block__link-forward" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonReg({ src, onClick, textContent }) {
  return (
    <a className="welcome-block__registration" href="/registration" onClick={onClick}>
      <button className={`button button-reg`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonToEnter({ src, onClick, textContent }) {
  return (
    <a className="welcome-block__registration" href="/" onClick={onClick}>
      <button className={`button button-reg`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonProfile({ onClick, textContent }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) onClick()
    navigate(`/profile`)
  }

  return (
    <button className={`button button-profile`} onClick={handleClick}>
      <span className="button_text">{textContent}</span>
    </button>
  )
}

export function ButtonActivity({ src, onClick, textContent }) {
  return (
    <a className="welcome-block__profile" onClick={onClick}>
      <button className={`button button-profile`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function CButtonProfile({ children, points, onClick }) {
  const navigate = useNavigate()

  const handleClick = (e) => {
    if (onClick) onClick()
    e.preventDefault()
    navigate(`/profile`)
  }

  return (
    <button className="button cbutton-profile" onClick={handleClick}>
      <div className="points">
        {points}
        <svg
          style={{ marginLeft: '10px' }}
          width="20"
          height="26"
          viewBox="0 0 20 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.4006 24.6937C11.2411 25.0524 11.5086 25.4685 11.8968 25.411C16.6002 24.7139 19.5 20.5418 19.5 15.4992C19.5 12.9861 19.0965 9.13001 16.3843 7.17539C16.2387 7.07049 16.0486 7.23622 16.1055 7.40702C16.4411 8.41389 16.5 10.5 15.5 10.5C14.5 10.5 14.89 9.47807 14.6806 8.30922C14.5567 7.61724 14.4079 6.78662 14.0714 5.94027C13.2108 3.7753 11.5314 0.786565 6.69711 0.500272C6.50649 0.488983 6.37984 0.832126 6.49615 0.984499C7.9003 2.82401 8.5101 8.5 6.5 8.5C5.27793 8.5 5.40407 6.37078 6.12558 4.67401C6.19634 4.50762 6.01422 4.34151 5.86332 4.44003C0.923228 7.66521 0.5 12.9253 0.5 15.4992C0.5 20.5418 3.39983 24.7139 8.10319 25.411C8.49142 25.4685 8.75887 25.0524 8.59941 24.6937C8.16128 23.7084 7.7381 22.3583 7.7381 20.8689C7.7381 17.32 9.32354 15.7871 9.79647 15.044C9.89448 14.89 10.1055 14.89 10.2035 15.044C10.6765 15.7871 12.2619 17.32 12.2619 20.8689C12.2619 22.3583 11.8387 23.7084 11.4006 24.6937Z"
            fill="white"
          />
        </svg>
      </div>
      {children}
    </button>
  )
}

export function ButtonDelete({ src, onClick, textContent }) {
  return (
    <a className="button__delete" onClick={onClick}>
      <button className={`button button-delete`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonExit({ src, onClick, textContent }) {
  return (
    <a className="button__delete" onClick={onClick}>
      <button className={`button button-exit`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}
