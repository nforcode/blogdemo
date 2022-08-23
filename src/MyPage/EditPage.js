import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { editPost, myPost } from "../WebApi";
import { AuthContext } from "../contexts";
const EditContainer = styled.form`
  min-height: 100vh;
  background: black;
  color: white;
  padding: 2rem;
  @media screen and (max-width: 767px) {
    margin-top: 50px;
    padding: 2rem 0;
    background: gray;
  }
`;

const EditWrap = styled.div`
  min-height: 100vh;
  padding: 0 5rem;
  letter-spacing: 0.2rem;
  border: 1rem solid rgba(255, 255, 255, 0.3);
  @media screen and (max-width: 767px) {
    margin: 0 2rem;
    padding: 0;
    background: white;
    color: black;
  }
`;

const EditTitle = styled.input`
  display: block;
  margin: 5rem auto;
  margin-bottom: 5px;
  width: 278px;
  @media screen and (max-width: 767px) {
    margin: 2rem;
    width: 80%;
    height: 2rem;
    font-size: 2rem;
  }
`;
const EditAuthor = styled.div`
  display: inline;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media screen and (max-width: 767px) {
    display: block;
    margin-left: 2rem;
  }
`;

const EditDate = styled.div`
  display: inline;
  @media screen and (max-width: 767px) {
    display: block;
    margin-top: 1rem;
  }
`;
const Divider = styled.div`
  border-top: 0.2rem solid rgba(255, 255, 255, 0.3);
  margin: 2rem 0;
  @media screen and (max-width: 767px) {
    margin-right: 2rem;
    border-top: 0.2rem solid gray;
  }
`;
const EditBody = styled.textarea`
  display: block;
  margin: 0 auto;
  resize: none;
  width: 280px;
  @media screen and (max-width: 767px) {
    margin: 2rem;
    width: 80%;
    font-size: 2rem;
  }
`;
const SubmitButton = styled.button`
  display: block;
  width: 3rem;
  margin: 1rem auto;
  @media screen and (max-width: 767px) {
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
  @media screen and (max-width: 767px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: 4rem;
    height: 15%;
    font-size: 1.5rem;
    border-radius: 1rem;
  }
`;
const EditFooter = styled.div`
  display: flex;
`;

export default function EditPage() {
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [apierror, setApiError] = useState("");
  const { user } = useContext(AuthContext);
  const postID = window.location.pathname.toString().split("/").pop();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      myPost(user).then((posts) => {
        const Bucket = posts.find((post) => post.id === Number(postID));
        setTitle(Bucket.title);
        setBody(Bucket.body);

        return setPost(Bucket);
      });
    }
  }, [user, postID]);
  const handleEdit = (e) => {
    const editAt = new Date().getTime().toString();
    e.preventDefault();
    editPost(user.id, postID, title, body, post.createdAt, editAt)
      .then(() => {
        alert("修改成功");
        myPost(user);
        setApiError(null);
        navigate("/my");
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  const handleCancel = () => {
    navigate("/my");
  };

  return (
    <EditContainer onSubmit={handleEdit}>
      {post && (
        <EditWrap>
          <EditTitle
            type="text"
            placeholder="請輸入標題(20字內)"
            maxLength="20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></EditTitle>
          <EditAuthor>
            作者：{user.nickname && user.nickname ? user.nickname : "匿名"}
            <EditDate>
              {new Date(Number(post.createdAt)).toLocaleString()}
            </EditDate>
            <Divider></Divider>
          </EditAuthor>
          <EditBody
            rows={10}
            placeholder="請輸入內文(500字內)"
            maxLength="500"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></EditBody>

          <EditFooter>
            <SubmitButton>送出</SubmitButton>
            <CancelButton onclick={handleCancel}>取消</CancelButton>
          </EditFooter>
        </EditWrap>
      )}

      {apierror && <alert>{apierror.toString()}</alert>}
    </EditContainer>
  );
}
