import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts";
import { myPost, delPost } from "../WebApi";
const MyMainPage = styled.div`
  padding: 10px;
  height: 100%;
  background: black;
  color: white;
  @media screen and (max-width: 992px) {
    margin-top: 50px;
    background: gray;
    margin-left: auto;
    margin-right: auto;
  }
`;
const MyPostContainer = styled.div`
  margin: 0 auto;
  border-bottom: 1px solid silver;
  position: relative;
`;
const MyPostTitle = styled(Link)`
  width: 98%;
  display: block;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  margin-left: 0.4rem;
  font-size: 1.8rem;
  height: 4rem;
  overflow: hidden;
  color: white;
  text-decoration: none;
  font-weight: 900;
  @media screen and (max-width: 992px) {
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
    color: black;
    background: white;
    border-radius: 1rem;
    text-align: center;
    line-height: 4rem;
  }
`;
const MyPostDate = styled.div`
  position: absolute;
  right: 0.4rem;
  bottom: 0.4rem;

  /* lg */
  @media screen and (max-width: 992px) {
    position: static;
    text-align: center;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 0.6rem;
    width: 7rem;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0.4rem;
    padding: 0.4rem 0;
  }
`;
const MyButton = styled.button``;
const MyErrorMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;

const MyFooter = styled.div`
  height: 20px;
`;

function Post({ post, handleDelete, handleEdit }) {
  var moment = require("moment");
  moment().format();
  return (
    <MyPostContainer>
      <MyPostTitle to={`/content/${post.id}`}>{post.title}</MyPostTitle>

      <MyPostDate>
        {moment(Number(post.createdAt)).format("YYYY/MM/DD")}
      </MyPostDate>
      <MyButton
        onClick={() => {
          handleEdit(post.id);
        }}
      >
        修改
      </MyButton>
      <MyButton
        onClick={() => {
          handleDelete(post.id);
        }}
      >
        刪除
      </MyButton>
    </MyPostContainer>
  );
}
export default function MyPage() {
  const [posts, setPosts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleEdit = (id) => {
    if (id) {
      navigate(`/posts/${id}`);
    }
  };

  const handleDelete = (id) => {
    delPost(id)
      .then(() => {
        alert("刪除成功");
        myPost(user).then((posts) => setPosts(posts));
        setApiError(null);
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  useEffect(() => {
    if (user) {
      myPost(user).then((posts) => setPosts(posts));
    }
  }, [user]);
  return (
    <MyMainPage>
      {posts &&
        posts.map((post) => (
          <Post
            post={post}
            key={post.id}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      {posts.length === 0 && (
        <MyErrorMessage style={{ color: "white" }}>
          點選發文來張貼你的第一篇文章吧
        </MyErrorMessage>
      )}
      {apiError && (
        <MyErrorMessage>somthing wrong.{apiError.toString()}</MyErrorMessage>
      )}
      <MyFooter />
    </MyMainPage>
  );
}

Post.propTypes = {
  post: PropTypes.object,
};
