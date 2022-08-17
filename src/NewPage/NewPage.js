import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { newPost, getMe } from "../WebApi";
import { AuthContext } from "../contexts";
import { setAuthToken } from "../utils";
const NewContainer = styled.form`
  min-height: 100vh;
  background: black;
  color: white;
  padding: 2rem;
  @media screen and (max-width: 992px) {
    margin-top: 50px;
    padding: 2rem 0;
    background: gray;
  }
`;
const NewWrap = styled.div`
  min-height: 100vh;
  padding: 0 5rem;
  letter-spacing: 0.2rem;
  border: 1rem solid rgba(255, 255, 255, 0.3);
  @media screen and (max-width: 992px) {
    margin: 0 2rem;
    padding: 0;
    background: white;
    color: black;
  }
`;
const Title = styled.input`
  display: block;
  margin: 5rem auto;
  margin-bottom: 5px;
  width: 278px;
  @media screen and (max-width: 992px) {
    margin: 2rem;
    width: 80%;
    height: 2rem;
    font-size: 1.5rem;
  }
`;
const Author = styled.div`
  display: inline;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media screen and (max-width: 992px) {
    display: block;
    margin-left: 2rem;
  }
`;

const Date = styled.div`
  display: inline;
  @media screen and (max-width: 992px) {
    display: block;
    margin-top: 1rem;
  }
`;
const Divider = styled.div`
  border-top: 0.2rem solid rgba(255, 255, 255, 0.3);
  margin: 2rem 0;
  @media screen and (max-width: 992px) {
    margin-right: 2rem;
    border-top: 0.2rem solid gray;
  }
`;
const PostArea = styled.textarea`
  display: block;
  margin: 0 auto;
  resize: none;
  width: 280px;
  @media screen and (max-width: 992px) {
    margin: 2rem;
    width: 80%;
    font-size: 1.5rem;
  }
`;
const SubmitButton = styled.button`
  display: block;
  width: 3rem;
  margin: 1rem auto;
  @media screen and (max-width: 992px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 4rem;
    height: 15%;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
`;
const CancelButton = styled.button`
  display: block;
  width: 3rem;
  margin: 1rem auto;
  @media screen and (max-width: 992px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 4rem;
    height: 15%;
    font-size: 1.5rem;
    border-radius: 1rem;
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
    setErrorMessage(null);
    newPost(title, body, user.nickname).then((data) => {
      if (data.ok === 0) {
        return setErrorMessage(data.message);
      }
      navigate("/my");
    });
  };

  const handleCancel = () => {
    navigate("/");
  };
  return (
    <NewContainer onSubmit={handleFormSubmit}>
      <NewWrap>
        <Title
          placeholder="請輸入標題(20字內)"
          maxLength="20"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Author>
          作者：{user.nickname && user.nickname ? user.nickname : "匿名"}
          <Date></Date>
          <Divider></Divider>
        </Author>
        <PostArea
          rows={10}
          placeholder="請輸入內文(500字內)"
          maxLength="500"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <NewFooter>
          <SubmitButton>送出</SubmitButton>
          <CancelButton onClick={handleCancel}>刪除</CancelButton>
        </NewFooter>
        {errorMessage && <Errormsg>{errorMessage}</Errormsg>}
      </NewWrap>
    </NewContainer>
  );
}
