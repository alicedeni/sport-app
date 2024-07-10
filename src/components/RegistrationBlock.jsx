import React, { useState } from 'react';
import axios from 'axios';
import { ButtonEnter, ButtonToEnter, ButtonNext } from "./Buttons";

import { link } from '../consts.js';

const RegistrationBlock = () => {
  const [formState, setFormState] = useState("registration");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_check, setPasswordCheck] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setError("Пожалуйста, введите email и пароль.");
    } else if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный email.");
    } else {
      setError("");
      axios.post(`${link}/register`, { name, surname, patronymic, email, password })
        .then(response => {
          if (response.data.status === 200) {
            window.location.href = '/';
          }
        })
        .catch(error => {
          console.error(error);
          setError("Заполните все поля");
        });
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleFormChange = () => {
    if ("registration" && surname && name && patronymic) {
      setFormState("registration2");
    } else {
      setFormState("registration");
    }
  };

  const handleSurnameChange = (e) => {
    setSurname(e.target.value);
    const isButtonEnabled = surname && name && patronymic;
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    const isButtonEnabled = surname && name && patronymic;
  };

  const handlePatronymicChange = (e) => {
    setPatronymic(e.target.value);
    const isButtonEnabled = surname && name && patronymic;
  };

  const isFormReg = formState === "registration2";
  const isButtonEnabled = surname && name && patronymic;

  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
      <form onSubmit={handleLogin}>
        {isFormReg ? (
          <>
              <input
                  className="welcome-block__input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
              <input
                  className="welcome-block__input"
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
              <input
                  className="welcome-block__input"
                  type="password"
                  placeholder="Повторите пароль"
                  value={password_check}
                  onChange={(e) => setPasswordCheck(e.target.value)}
                  required
              />
              {error && <p className="error" style={{ color: "red" }}>{error}</p>}
              <ButtonEnter className="welcome-block__btn" text="Зарегистрироваться" type="submit" textContent={"Зарегистрироваться"}></ButtonEnter>
          </>
          
        ) : (
          <>
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Фамилия"
              value={surname}
              onChange={handleSurnameChange}
              required
            />
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Имя"
              value={name}
              onChange={handleNameChange}
              required
            />
            <input
              className="welcome-block__input"
              type="text"
              placeholder="Отчество"
              value={patronymic}
              onChange={handlePatronymicChange}
              required
            />
            <ButtonNext className="welcome-block__btn" text="Далее" onClick={handleFormChange} type="button" disabled={!surname || !name || !patronymic} textContent={"Далее"}></ButtonNext>
          </>
        )}
      </form>
      <ButtonToEnter className="welcome-block__btn" text="Войти" textContent={"Войти"}></ButtonToEnter>
    </div>
  );
}

export default RegistrationBlock;