import React, { useState } from 'react';
import axios from 'axios';
import { ButtonEnter, ButtonReg } from "./Buttons";


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
      axios.post('http://localhost:5000/login', { email, password })
        .then(response => {
          if (response.data.status === 200) {
            checkHelloStatus();
          } else {
            console.error(error);
            setError("Произошла ошибка при входе.");
          }
        })
        .catch(error => {
          console.error(error);
          setError("Произошла ошибка при входе.");
        });
    }
  };

  const checkHelloStatus = () => {
    axios.get('http://localhost:5000/get_hello_status')
      .then(response => {
        if (response.data.f_hello === false) {
          axios.post('http://localhost:5000/update_f_hello')
            .then(() => {
              window.location.href = '/about';
            })
            .catch(error => {
              console.error('Error updating f_hello', error);
              setError("Произошла ошибка при обновлении статуса.");
            });
        } else {
          window.location.href = '/main';
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