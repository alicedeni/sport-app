import React, { useState } from 'react';
import { ButtonEnter, ButtonToEnter, ButtonNext } from "./Buttons";

const RegistrationBlock = () => {
  const [formState, setFormState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_check, setPasswordCheck] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      setError("Пожалуйста, введите email и пароль.");
    } else if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный email.");
    } else {
      setError("");
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };


  const handleFormChange = () => {
    if (formState === "registration") {
      setFormState("");
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

  const isFormReg = formState === "registration";
  const isButtonEnabled = surname && name && patronymic;

  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
      {isFormReg ? (
        <>
            <input
                className="welcome-block__input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="welcome-block__input"
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                className="welcome-block__input"
                type="password"
                placeholder="Повторите пароль"
                value={password_check}
                onChange={(e) => setPasswordCheck(e.target.value)}
            />
            {error && <p className="error" style={{ color: "red" }}>{error}</p>}
            <ButtonEnter className="welcome-block__btn" text="Зарегистрироваться" onClick={handleLogin} textContent={"Зарегистрироваться"}></ButtonEnter>
        </>
        
      ) : (
        <>
          <input
            className="welcome-block__input"
            type="text"
            placeholder="Фамилия"
            value={surname}
            onChange={handleSurnameChange}
          />
          <input
            className="welcome-block__input"
            type="text"
            placeholder="Имя"
            value={name}
            onChange={handleNameChange}
          />
          <input
            className="welcome-block__input"
            type="text"
            placeholder="Отчество"
            value={patronymic}
            onChange={handlePatronymicChange}
          />
          <ButtonNext className="welcome-block__btn" text="Далее" onClick={handleFormChange} textContent={"Далее"} disabled={!isButtonEnabled}></ButtonNext>
        </>
      )}
      <ButtonToEnter className="welcome-block__btn" text="Войти" textContent={"Войти"}></ButtonToEnter>
    </div>
  );
}

export default RegistrationBlock;