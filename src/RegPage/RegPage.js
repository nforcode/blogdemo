import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { reg, getMe } from "../WebApi";
import { setAuthToken } from "../utils";
import { AuthContext } from "../contexts";
const RegForm = styled.form`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  color: black;

  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const RegWrap = styled.div`
  width: 250px;
  height: 250px;
  margin: 50px auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  border: 1px solid grey;
  @media screen and (max-width: 767px) {
    margin: 20px auto;
    width: 80%;
    height: 80%;
    font-size: 2rem;
  }
`;
const RegUsername = styled.div`
  margin-top: 20px;
`;
const RegNickname = styled.div`
  margin-top: 20px;
`;
const RegPassword = styled.div`
  margin-top: 20px;
`;
const Input = styled.input`
  border: none;
  outline: medium;
  border-bottom: 1px solid gray;
  @media screen and (max-width: 767px) {
    margin: 20px;
    width: 80%;
    font-size: 1.5rem;
  }
`;
const RegButton = styled.button`
  width: 60px;
  margin: 20px auto;
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
export default function RegPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("blogdemo");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    reg(username, password, nickname).then((data) => {
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
    <RegForm onSubmit={handleSubmit}>
      <RegWrap>
        <RegUsername>
          username:{" "}
          <Input
            placeholder="請輸入帳號(10字以內)"
            maxLength="10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </RegUsername>
        <RegNickname>
          nickname:{" "}
          <Input
            placeholder="請輸入暱稱(10字以內)"
            maxLength="10"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </RegNickname>
        <RegPassword>
          password:{" "}
          <Input
            placeholder="請輸入密碼(10字以內)"
            maxLength="10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </RegPassword>
        <RegButton>註冊</RegButton>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </RegWrap>
    </RegForm>
  );
}
