import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts";
import { setAuthToken, getAuthToken } from "../utils";
import { getAPost, getMe } from "../WebApi";
import { useNavigate } from "react-router-dom";
const CtContainer = styled.div`
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
const CtWrap = styled.div`
  padding: 0 5rem;
  letter-spacing: 0.2rem;
  border: 1rem solid rgba(255, 255, 255, 0.3);
  position: relative;
  @media screen and (max-width: 992px) {
    margin: 0 2rem;
    padding: 0;
    background: white;
    color: black;
  }
`;
const CtTitle = styled.div`
  padding-top: 5rem;
  font-size: 2rem;
  line-height: 3rem;

  @media screen and (max-width: 992px) {
    margin-left: 2rem;
  }
`;
const CtAuthor = styled.div`
  display: inline;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media screen and (max-width: 992px) {
    display: block;
    margin-left: 2rem;
  }
`;
const Blank = styled.p`
  display: inline;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;
const CtDate = styled.div`
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
const CtBody = styled.div`
  margin: 5rem 0;
  margin-right: -1rem;
  padding-bottom: 5rem;
  font-size: 1.2rem;
  line-height: 1.8rem;
  word-wrap: break-word;
  @media screen and (max-width: 992px) {
    margin-left: 2rem;
    margin-right: 1rem;
  }
`;

const EdDate = styled.div`
  display: inline;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media screen and (max-width: 992px) {
    display: block;
    margin-left: 2rem;
  }
`;
//Form-start
const ResponseForm = styled.form`
  display: flex;
  position: relative;
  margin: 0 2rem;
  @media screen and (max-width: 992px) {
    background: white;
    color: black;
  }
`;
const ResMsg = styled.textarea`
  width: 95%;
  margin: 35px auto;

  @media screen and (max-width: 992px) {
    margin: 0 auto;
    margin-bottom: 35px;
  }
`;
const ResButton = styled.button`
  position: absolute;
  right: 10px;
  bottom: 5px;
`;
const Resnologin = styled.div`
  position: absolute;
  right: 10px;
  bottom: 5px;
`;
//Form-end
const ArticleContainer = styled.div`
  margin: 2rem;
`;

const ResWrap = styled.div`
  position: relative;
  @media screen and (max-width: 992px) {
    border: 1px solid white;
    background: black;
  }
`;
const ResAuthor = styled.div`
  display: inline;
  margin-top: 1rem;
  font-size: 0.9rem;
  @media screen and (max-width: 992px) {
    display: block;
    margin-left: 2rem;
  }
`;
const ResDate = styled.div`
  display: inline;
  @media screen and (max-width: 992px) {
    display: block;
    margin-top: 1rem;
  }
`;
const ResBody = styled.div`
  margin-right: -1rem;
  padding-bottom: 5rem;
  font-size: 1.2rem;
  line-height: 1.8rem;
  word-wrap: break-word;
  @media screen and (max-width: 992px) {
    margin-left: 2rem;
    margin-right: 1rem;
  }
`;

function ArticleRes({ user, comment, post, handleDelete }) {
  return (
    <ResWrap>
      <ResAuthor>
        作者：
        {comment.cmnickname && comment.cmnickname ? comment.cmnickname : "匿名"}
        <ResDate>
          <Blank>{" | "}</Blank>
          {new Date(Number(comment.cmAt)).toLocaleString()}
        </ResDate>
        <Divider></Divider>
      </ResAuthor>
      <ResBody>{comment.cmmsg}</ResBody>
      {comment &&
      user &&
      (user.id === comment.cmuserid || user.id === post.userId) ? (
        <ResButton onClick={(e) => handleDelete(e, comment.cmid)}>
          刪除
        </ResButton>
      ) : (
        <></>
      )}
    </ResWrap>
  );
}
export default function Content() {
  const postID = window.location.hash.toString().slice(10);
  const [post, setPost] = useState([]);
  const [msg, setMsg] = useState("");
  const [apierror, setApiError] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // const Bucket = post.find((post) => post.id === Number(postID));
  useEffect(() => {
    window.scrollTo(0, 0);
    getAPost(postID).then((data) => setPost(data));
    getMe().then((response) => {
      if (response.ok !== 1) {
        setAuthToken(null);
      }
      setUser(response.data);
    });
  }, [setUser, postID]);

  const handleEdit = () => {
    if (postID) {
      navigate(`/posts/${postID}`);
    }
  };
  const handlesendres = (e) => {
    const editAt = new Date().getTime().toString();
    const token = getAuthToken(AuthContext);
    const maxcmid = () => {
      if (post.comments.length > 0) {
        return Number(Math.max(...post.comments.map((p) => p.cmid)) + 1);
      }
      return 0;
    };

    e.preventDefault();
    if (msg.length <= 0) {
      alert("請輸入留言內容");
      return;
    }

    return fetch(`https://student-json-api.lidemy.me/posts/${postID}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comments: [
          ...post.comments,
          {
            cmid: maxcmid(),
            cmuserid: user.id,
            cmnickname: user.nickname,
            cmmsg: msg,
            cmAt: editAt,
          },
        ],
      }),
    })
      .then(() => {
        setMsg("");
        setApiError(null);
        getAPost(postID).then((data) => setPost(data));
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  const handleDelete = (e, thiscmid) => {
    const token = getAuthToken(AuthContext);
    const delcomments = post.comments.filter(
      (comment) => comment.cmid !== thiscmid
    );

    e.preventDefault();
    return fetch(`https://student-json-api.lidemy.me/posts/${postID}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comments: delcomments,
      }),
    })
      .then(() => {
        setMsg("");
        setApiError(null);
        getAPost(postID).then((data) => setPost(data));
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  return (
    <CtContainer>
      {post && (
        <>
          <CtWrap>
            <CtTitle>{post.title}</CtTitle>
            <CtAuthor>
              作者：
              {post.nickname && post.nickname ? post.nickname : "匿名"}
              <CtDate>
                <Blank>{" | "}</Blank>
                {new Date(Number(post.createdAt)).toLocaleString()}
              </CtDate>
              <Divider></Divider>
            </CtAuthor>
            <CtBody>{post.body}</CtBody>
            {user && user.id === post.userId && (
              <ResButton onClick={handleEdit}>編輯</ResButton>
            )}
            {post.editAt && (
              <EdDate>
                最後編輯時間：
                <br />
                {new Date(Number(post.editAt)).toLocaleString()}
              </EdDate>
            )}
          </CtWrap>
          {post && user ? (
            <ResponseForm onSubmit={handlesendres}>
              {/* <ResAuthor>{user.nickname}</ResAuthor> */}
              <ResMsg
                rows={5}
                placeholder="請輸入內文(100字內)"
                maxLength="100"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              ></ResMsg>
              <ResButton>送出</ResButton>
              {apierror && <alert>{apierror.toString()}</alert>}
            </ResponseForm>
          ) : (
            <ResponseForm>
              {/* <ResAuthor>{user.nickname}</ResAuthor> */}
              <ResMsg
                rows={5}
                placeholder="欲留言請先登入"
                maxLength="100"
              ></ResMsg>
              <Resnologin> 您尚未登入</Resnologin>
            </ResponseForm>
          )}
          <ArticleContainer>
            {post.comments &&
              post.comments.map((comment) => (
                <ArticleRes
                  comment={comment}
                  handleDelete={handleDelete}
                  user={user}
                  post={post}
                  key={comment.cmid}
                />
              ))}
          </ArticleContainer>
        </>
      )}
    </CtContainer>
  );
}

ArticleRes.propTypes = {
  comment: PropTypes.object,
};
