import React, { useState, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../contexts";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { myPost, delPost } from "../WebApi";
import dayjs from "dayjs";

const PostContainer = styled.div`
  margin: 40px auto;
  position: relative;
  height: 100px;
  width: 692px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 40px;
  @media screen and (max-width: 767px) {
    width: auto;
    max-width: 600px;
  }
`;
const ArthurLink = styled(Link)`
  color: black;
  text-decoration: none;
`;
const Avatar = styled.img`
  height: 20px;
  width: 20px;
  position: absolute;
  top: 0;
  border-radius: 10px;
`;
const PostArthur = styled.span`
  margin-left: 25px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PostTitle = styled(Link)`
  text-decoration: none;
  font-weight: 900;
  color: black;
  width: 70%;
  display: block;
  margin-top: 10px;
  @media screen and (max-width: 767px) {
  }
`;
const PostBody = styled(Link)`
  display: block;
  margin-top: 10px;
  height: 60px;
  width: 70%;
  color: grey;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: none;

  @media screen and (max-width: 767px) {
    display: none;
  }
`;
const PostDate = styled.span`
  max-width: 200px;
  overflow: hidden;
  position: absolute;
  bottom: 20px;
  left: 0px;
  font-size: 0.7rem;
  color: grey;
  /* lg */
  @media screen and (max-width: 767px) {
  }
`;
const PostReplyNumber = styled(Link)`
  max-width: 200px;
  overflow: hidden;
  position: absolute;
  bottom: 20px;
  left: 90px;
  font-size: 0.7rem;
  color: grey;
  text-decoration: none;
`;
const LinkPic = styled(Link)`
  height: 100px;
  width: 100px;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
`;
const Pic = styled.img`
  height: 100%;
`;
const ButtonWrap = styled.div`
  display: flex;
  position: absolute;
  right: -10px;
  bottom: 10px;
`;
const Button = styled.button`
  display: block;
  border: none;
  border-radius: 10px;
  margin-right: 10px;
  padding: 3px 10px;
`;

const MyErrorMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;
export default function Post({ post }) {
  const [setPosts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const arthurID = window.location.pathname.toString().split("/").pop();

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

  return (
    <PostContainer>
      <ArthurLink to={`/user/${post.userId}`}>
        <Avatar src={`https://i.pravatar.cc/20?img=${post.id}`} />
        <PostArthur>{post.nickname}</PostArthur>
      </ArthurLink>
      <PostTitle to={`/content/${post.id}`}>{post.title}</PostTitle>
      <PostBody to={`/content/${post.id}`}>{post.body}</PostBody>
      <PostDate>{dayjs(Number(post.createdAt)).format("YYYY/MM/DD")}</PostDate>
      <PostReplyNumber to={`/content/${post.id}`}>
        留言數：{post.comments.length}
      </PostReplyNumber>
      <LinkPic to={`/content/${post.id}`}>
        <Pic src={`https://picsum.photos/200/200/?random=${post.id} `} />
      </LinkPic>
      {user && arthurID === user.id && user.id === post.userId && (
        <ButtonWrap>
          <Button
            onClick={() => {
              handleEdit(post.id);
            }}
          >
            編輯
          </Button>

          <Button
            onClick={() => {
              handleDelete(post.id);
            }}
          >
            刪除
          </Button>
        </ButtonWrap>
      )}
      {apiError && (
        <MyErrorMessage>somthing wrong.{apiError.toString()}</MyErrorMessage>
      )}
    </PostContainer>
  );
}
Post.propTypes = {
  post: PropTypes.object,
};
