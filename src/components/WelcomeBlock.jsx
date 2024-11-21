import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ButtonEnter, ButtonReg } from "./Buttons";

import { link } from '../consts.js';

const WelcomeBlock = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 
  const handleLogin = (event) => {
    event.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setError("Пожалуйста, введите email и пароль.");
    } else if (!validateEmail(email)) {
      setError("Пожалуйста, введите корректный email.");
    } else {
      setError("");
      console.log({ email, password });
      const token = localStorage.getItem('token');
      axios.post(`${link}/login`, { email, password }, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(response => {
          console.log(response.data);
          if (response.data.status === 200) {
            console.log(response.data.token);
            localStorage.setItem('token', response.data.token);
            checkHelloStatus();
          } else {
            console.error(error);
            setError("Произошла ошибка при входе.");
          }
        })
        .catch(error => {
          console.error('Ошибка Axios:', error);
          if (error.response) {
              console.error('Данные ответа:', error.response.data);
              console.error('Статус ответа:', error.response.status);
          } else if (error.request) {
              console.error('Запрос был сделан, но ответа не получено:', error.request);
          } else {
              console.error('Ошибка при настройке запроса:', error.message);
          }
          setError("Произошла ошибка при входе.");
      });
    }
  };

  const checkHelloStatus = () => {
    const token = localStorage.getItem('token');
    axios.get(`${link}/user/get_hello_status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data.f_hello === false) {
          axios.post(`${link}/user/update_f_hello`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(() => {
              window.location.href = '/about';
            })
            .catch(error => {
              console.error('Error updating f_hello', error);
              setError("Произошла ошибка при обновлении статуса.");
            });
        } else {
          window.location.href = `/main`;
        }
      })
      .catch(error => {
        console.error('Error checking hello status', error);
        setError("Произошла ошибка при проверке статуса.");
      });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  
  return (
    <div className="welcome-block">
      <h1 className="welcome-block__text">Добро пожаловать!</h1>
      <form onSubmit={handleLogin}>
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
        <ButtonEnter className="welcome-block__btn" text="Войти" textContent={"Войти"}></ButtonEnter>
      </form>
      <ButtonReg className="welcome-block__btn" text="Зарегистрироваться" textContent={"Зарегистрироваться"}></ButtonReg>
    </div>
  );
}

export default WelcomeBlock;