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
  margin: 0 auto;
  color: black;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const RegWrap = styled.div`
  width: 600px;
  height: 420px;
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
const RegLabel = styled.span`
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
const RegButton = styled.button`
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
        <RegLabel>
          username{" "}
          <Input
            placeholder="請輸入帳號(10字以內)"
            maxLength="10"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </RegLabel>
        <RegLabel>
          nickname{" "}
          <Input
            placeholder="請輸入暱稱(10字以內)"
            maxLength="10"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </RegLabel>
        <RegLabel>
          password{" "}
          <Input
            placeholder="請輸入密碼(10字以內)"
            maxLength="10"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </RegLabel>
        <RegButton>註冊</RegButton>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </RegWrap>
    </RegForm>
  );
}
