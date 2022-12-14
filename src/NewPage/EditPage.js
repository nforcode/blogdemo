import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { editPost, myPost } from "../WebApi";
import { AuthContext } from "../contexts";
const EditContainer = styled.form`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;

const EditWrap = styled.div`
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

const EditTitle = styled.input`
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
const EditBody = styled.textarea`
  display: block;
  margin-top: 20px;
  margin-left: 20px;
  width: 93%;
  font-size: 1rem;
  line-height: 1.5rem;
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
        alert("????????????");
        myPost(user);
        setApiError(null);
        navigate(`/user/${user.id}`);
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  const handleCancel = () => {
    navigate(`/user/${user.id}`);
  };

  return (
    <EditContainer onSubmit={handleEdit}>
      {post && (
        <EditWrap>
          <Title>?????????</Title>
          <EditTitle
            placeholder="???????????????(20??????)"
            maxLength="20"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></EditTitle>

          <Body>?????????</Body>
          <EditBody
            rows={10}
            placeholder="???????????????(500??????)"
            maxLength="500"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></EditBody>

          <EditFooter>
            <SubmitButton>??????</SubmitButton>
            <SubmitButton onclick={handleCancel}>??????</SubmitButton>
          </EditFooter>
        </EditWrap>
      )}

      {apierror && <alert>{apierror.toString()}</alert>}
    </EditContainer>
  );
}
