import React, { useState } from 'react';
import { ButtonEnter, ButtonReg } from "./Buttons";

const WelcomeBlock = () => {
  const [formState, setFormState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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


  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
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
          {error && <p className="error" style={{ color: "red" }}>{error}</p>}
          <ButtonEnter className="welcome-block__btn" text="Войти" onClick={handleLogin} textContent={"Войти"}></ButtonEnter>
      <ButtonReg className="welcome-block__btn" text="Зарегистрироваться" textContent={"Зарегистрироваться"}></ButtonReg>
    </div>
  );
}

export default WelcomeBlock;