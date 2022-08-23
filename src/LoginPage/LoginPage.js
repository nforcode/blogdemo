import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { login, getMe } from "../WebApi";
import { setAuthToken } from "../utils";
import { AuthContext } from "../contexts";
const LoginForm = styled.form`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;

  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const LoginWrap = styled.div`
  width: 250px;
  height: 250px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  text-align: center;
  @media screen and (max-width: 767px) {
    width: 80%;
    height: 80%;
    font-size: 2rem;
  }
`;
const LoginUsername = styled.div`
  margin-top: 20px;
`;

const LoginPassword = styled.div`
  margin-top: 20px;
`;
const Input = styled.input`
  border: none;
  outline: medium;
  border-bottom: 1px solid gray;
  @media screen and (max-width: 767px) {
    margin: 2rem;
    width: 80%;
    height: 2rem;
    font-size: 2rem;
  }
`;
const LoginButton = styled.button`
  width: 3rem;
  margin: 1rem auto;
  border: none;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 50%;
    height: 15%;
    font-size: 1.5rem;
  }
`;
const Errormsg = styled.div`
  color: red;
`;

export default function LoginPage() {
  const [username, setUsername] = useState("testn");
  const [password, setPassword] = useState("blogdemo");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    login(username, password).then((data) => {
      if (data.ok === 0) {
        return setErrorMessage(data.message);
      }
      setAuthToken(data.token);
      getMe().then((response) => {
        if (response.ok !== 1) {
          setAuthToken(null);

          return setErrorMessage(response.toString());
        }
        setUser(response.data);
        navigate("/");
      });
    });
  };
  return (
    <LoginForm onSubmit={handleSubmit}>
      <LoginWrap>
        <LoginUsername>
          username:{" "}
          <Input
            placeholder="請輸入帳號"
            maxLength="10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </LoginUsername>
        <LoginPassword>
          password:{" "}
          <Input
            placeholder="請輸入密碼"
            maxLength="10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LoginPassword>
        <LoginButton>登入</LoginButton>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </LoginWrap>
    </LoginForm>
  );
}
