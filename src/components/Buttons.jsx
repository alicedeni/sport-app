export function ButtonEnter({src, onClick, textContent}) {
  return (
    <a className="welcome-block__link-forward" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}
export function ButtonNext({src, onClick, textContent}) {
  return (
    <a className="welcome-block__link-forward" onClick={onClick}>
      <button className={`button button-enter`}>
        <span className="button button-enter_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonReg({src, onClick, textContent}){
  return(
    <a className="welcome-block__registration" href="/registration" onClick={onClick}>
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
    <a className="welcome-block__profile" href="/profile" onClick={onClick}>
        <button className={`button button-profile`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonActivity({src, onClick, textContent}){
  return(
    <a className="welcome-block__profile" onClick={onClick}>
        <button className={`button button-profile`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function CButtonProfile({src, onClick, textContent}){
  return(
    <a className="cbutton__profile" href="/profile" onClick={onClick}>
        <button className={`button cbutton-profile`}>
        <span className="cbutton-profile_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonDelete({src, onClick, textContent}){
  return(
    <a className="button__delete" href="/" onClick={onClick}>
        <button className={`button button-delete`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonExit({src, onClick, textContent}){
  return(
    <a className="button__delete" href="/" onClick={onClick}>
        <button className={`button button-exit`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}