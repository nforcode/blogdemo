import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { reg, getMe } from "../WebApi";
import { setAuthToken } from "../utils";
import { AuthContext } from "../contexts";
const RegForm = styled.form`
  padding: 10px;
  min-height: 100vh;
  background: rgba(0, 0, 50);
  color: white;
  @media screen and (max-width: 992px) {
    margin-top: 60px;
  }
`;
const RegWrap = styled.div`
  background: rgba(30, 80, 20, 0.5);
  width: 250px;
  height: 250px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  text-align: center;
  @media screen and (max-width: 992px) {
    margin-top: 50px;
    width: 80%;
    height: 80%;
    font-size: 2rem;
  }
`;
const RegUsername = styled.div`
  margin-top: 1rem;
`;
const RegNickname = styled.div`
  margin-top: 1rem;
`;
const RegPassword = styled.div`
  margin-top: 1rem;
`;
const Input = styled.input`
  @media screen and (max-width: 992px) {
    margin: 2rem;
    width: 80%;
    height: 2rem;
    font-size: 2rem;
  }
`;
const RegButton = styled.button`
  width: 3rem;
  margin: 1rem auto;
  @media screen and (max-width: 992px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 50%;
    height: 15%;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
`;
const Errormsg = styled.div`
  color: red;
`;
export default function RegPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("Lidemy");
  const [nickname, setNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

  const handleSubmit = (e) => {
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </RegUsername>
        <RegNickname>
          nickname:{" "}
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </RegNickname>
        <RegPassword>
          password:{" "}
          <Input
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
