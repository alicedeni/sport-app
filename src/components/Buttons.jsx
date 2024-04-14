export function ButtonEnter({src, onClick, textContent}) {
  return (
    <a className="welcome-block__link-forward" href="/main" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}
export function ButtonNext({src, onClick, textContent}) {
  return (
    <a className="welcome-block__link-forward" href="#2" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonReg({src, onClick, textContent}){
  return(
    <a className="welcome-block__registration" href="/registration#1" onClick={onClick}>
        <button className={`button button-reg`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonToEnter({src, onClick, textContent}){
  return(
    <a className="welcome-block__registration" href="/" onClick={onClick}>
        <button className={`button button-reg`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonProfile({src, onClick, textContent}){
  return(
    <a className="welcome-block__profile" href="#" onClick={onClick}>
        <button className={`button button-profile`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}