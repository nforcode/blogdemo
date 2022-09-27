import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { newPost, getMe } from "../WebApi";
import { AuthContext } from "../contexts";
import { setAuthToken } from "../utils";
const NewContainer = styled.form`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const NewWrap = styled.div`
  margin: 40px auto;
  position: relative;
  min-height: 60vh;
  width: 692px;
  border: 1px solid grey;
  @media screen and (max-width: 767px) {
    width: auto;
    max-width: 600px;
  }
`;
const Title = styled.span`
  display: block;
  margin-top: 40px;
  margin-left: 20px;
`;
const PostTitle = styled.input`
  display: block;
  position: absolute;
  top: 40px;
  left: 85px;
  width: 69%;
  font-size: 1rem;
  outline: medium;
  @media screen and (max-width: 767px) {
  }
`;
const Body = styled.span`
  display: block;
  margin-top: 40px;
  margin-left: 20px;
`;
const PostBody = styled.textarea`
  display: block;
  margin-top: 20px;
  margin-left: 20px;
  width: 93%;
  font-size: 1rem;
  line-height: 1.8rem;
  word-wrap: break-word;
  resize: none;
  outline: medium;
  @media screen and (max-width: 767px) {
    width: 88%;
  }
`;
const SubmitButton = styled.button`
  margin: 60px auto;
  padding: 10px 40px;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  @media screen and (max-width: 767px) {
    margin-top: 70px;
    margin-bottom: 50px;
    width: 40%;
    height: 15%;
  }
`;

const NewFooter = styled.div`
  display: flex;
`;
const Errormsg = styled.div`
  color: red;
`;
export default function NewPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    getMe().then((response) => {
      if (response.ok !== 1) {
        setAuthToken(null);
      }
      setUser(response.data);
    });
  }, [setUser]);
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage(null);
    newPost(title, body, user.nickname).then((data) => {
      if (data.ok === 0) {
        return setErrorMessage(data.message);
      }
      navigate("user/:id");
    });
  };

  const handleCancel = () => {
    navigate("/");
  };
  return (
    <NewContainer onSubmit={handleFormSubmit}>
      <NewWrap>
        <Title>標題：</Title>
        <PostTitle
          placeholder="請輸入標題(20字內)"
          maxLength="20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Body>內文：</Body>
        <PostBody
          rows={10}
          placeholder="請輸入內文(500字內)"
          maxLength="500"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <NewFooter>
          <SubmitButton>送出</SubmitButton>
          <SubmitButton onClick={handleCancel}>取消</SubmitButton>
        </NewFooter>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </NewWrap>
    </NewContainer>
  );
}
