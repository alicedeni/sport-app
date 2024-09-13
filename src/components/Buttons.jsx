import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

export function ButtonProfile({ onClick, textContent }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleClick = () => {
    if (onClick) onClick(); 
    navigate(`/profile/${id}`); 
  };

  return (
    <button className={`button button-profile`} onClick={handleClick}>
      <span className="button_text">{textContent}</span>
    </button>
  );
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

export function CButtonProfile({ children, points, onClick }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleClick = (e) => {
    if (onClick) onClick(); 
    e.preventDefault(); 
    navigate(`/profile/${id}`);
  };

  return (
    <button className="button cbutton-profile" onClick={handleClick}>
      <div className="points">
        {points}
      </div>
      {children}
    </button>
  );
}

export function ButtonDelete({src, onClick, textContent}){
  return(
    <a className="button__delete" onClick={onClick}>
        <button className={`button button-delete`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}

export function ButtonExit({src, onClick, textContent}){
  return(
    <a className="button__delete" onClick={onClick}>
        <button className={`button button-exit`}>
        <span className="button_text">{textContent}</span>
      </button>
    </a>
  )
}