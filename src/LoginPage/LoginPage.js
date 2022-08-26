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
  width: 600px;
  height: 330px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  border: 1px solid grey;
  text-align: center;

  @media screen and (max-width: 767px) {
    width: 80%;
    height: 80%;
  }
`;
const LoginLabel = styled.span`
  font-size: 1.2rem;
  margin-top: 60px;
`;

const Input = styled.input`
  border: none;
  outline: medium;
  border-bottom: 1px solid gray;
  font-size: 1.2rem;
  margin-left: 10px;

  @media screen and (max-width: 767px) {
    width: 80%;
  }
`;
const LoginButton = styled.button`
  margin: 60px auto;
  padding: 10px 40px;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  @media screen and (max-width: 767px) {
    margin-top: 70px;
    margin-bottom: 50px;
    width: 50%;
    height: 15%;
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
        <LoginLabel>
          username{" "}
          <Input
            placeholder="請輸入帳號"
            maxLength="10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </LoginLabel>
        <LoginLabel>
          password{" "}
          <Input
            placeholder="請輸入密碼"
            maxLength="10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LoginLabel>
        <LoginButton>登入</LoginButton>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </LoginWrap>
    </LoginForm>
  );
}
