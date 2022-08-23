import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts";
import { setAuthToken, getAuthToken } from "../utils";
import { getPost, getMe } from "../WebApi";
import { useNavigate, Link } from "react-router-dom";
const CtContainer = styled.div`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const CtWrap = styled.div`
  margin: 40px auto;
  position: relative;
  min-height: 60vh;
  width: 692px;
  @media screen and (max-width: 767px) {
    width: auto;
    max-width: 600px;
  }
`;

const ArthurLink = styled(Link)``;
const Avatar = styled.img`
  height: 48px;
  width: 48px;
  position: absolute;
  border-radius: 48px;
  @media screen and (max-width: 767px) {
    left: 15px;
  }
`;
const CtAuthor = styled(Link)`
  display: inline-block;
  margin-left: 60px;
  max-width: 200px;
  text-decoration: none;
  color: black;
  position: absolute;
  @media screen and (max-width: 767px) {
    left: 15px;
  }
`;

const CtDate = styled.span`
  display: inline-block;
  position: absolute;
  top: 30px;
  left: 60px;
  font-size: 14px;
  color: grey;

  @media screen and (max-width: 767px) {
    left: 75px;
  }
`;

const CtTitle = styled.div`
  padding-top: 80px;
  font-size: 40px;
  line-height: 3rem;

  @media screen and (max-width: 767px) {
    margin: 0 15px;
  }
`;
const Pic = styled.img`
  display: block;
  margin: 30px 15px;
  width: 92%;
`;
const CtBody = styled.div`
  margin: 90px 0;
  font-size: 1.2rem;
  line-height: 1.8rem;
  word-wrap: break-word;
  @media screen and (max-width: 767px) {
    margin: 60px 15px;
  }
`;

const EdDate = styled.span`
  display: inline-block;
  font-size: 14px;
  color: grey;
  margin-left: 20px;
`;
const EditButton = styled.button`
  position: absolute;
  bottom: -46px;
  left: 20px;
  border: none;
  border-radius: 10px;
`;
//Form
const ResponseForm = styled.form`
  margin: 40px auto;
  position: relative;
  width: 692px;
  @media screen and (max-width: 767px) {
    width: auto;
    max-width: 600px;
  }
`;
const ResMsg = styled.textarea`
  width: 99%;
  margin: 35px auto;
  resize: none;
  outline: medium;
  @media screen and (max-width: 767px) {
    margin-left: 20px;
    width: 90%;
  }
`;
const ResButton = styled.button`
  position: absolute;
  right: 0px;
  bottom: 0px;
  border: none;
  border-radius: 10px;
  @media screen and (max-width: 767px) {
    right: 20px;
  }
`;
const Resnologin = styled.div`
  position: absolute;
  right: 10px;
  bottom: 5px;
`;
//Reply
const ArticleContainer = styled.div`
  margin: 20px;
`;

const ResWrap = styled.div`
  margin: 10px auto;
  position: relative;
  width: 692px;
  border-bottom: 1px solid gray;
  @media screen and (max-width: 767px) {
    width: auto;
    max-width: 600px;
  }
`;
const ResAvatar = styled.img`
  height: 32px;
  width: 32px;
  position: absolute;
  border-radius: 48px;
  @media screen and (max-width: 767px) {
  }
`;
const ResAuthor = styled.div`
  margin-left: 36px;
  font-size: 0.9rem;
  @media screen and (max-width: 767px) {
  }
`;
const ResDate = styled.div`
  position: absolute;
  top: 15px;
`;
const ResBody = styled.div`
  margin: 30px 0;

  font-size: 1.2rem;
  line-height: 1.8rem;
  word-wrap: break-word;
  @media screen and (max-width: 767px) {
  }
`;
const DelButton = styled.button`
  position: absolute;
  right: 0px;
  bottom: 5px;
  border: none;
  border-radius: 10px;
`;

function ArticleRes({ user, comment, post, handleDelete }) {
  return (
    <ResWrap>
      <ResAvatar src={`https://i.pravatar.cc/32?img=${comment.cmid}`} />
      <ResAuthor>
        {comment.cmnickname && comment.cmnickname ? comment.cmnickname : "匿名"}
        <ResDate>{new Date(Number(comment.cmAt)).toLocaleString()}</ResDate>
      </ResAuthor>
      <ResBody>{comment.cmmsg}</ResBody>
      {comment &&
      user &&
      (user.id === comment.cmuserid || user.id === post.userId) ? (
        <DelButton onClick={(e) => handleDelete(e, comment.cmid)}>
          刪除
        </DelButton>
      ) : (
        <></>
      )}
    </ResWrap>
  );
}
export default function Content() {
  const postID = window.location.pathname.toString().split("/").pop();
  const [post, setPost] = useState([]);
  const [msg, setMsg] = useState("");
  const [apierror, setApiError] = useState("");
  const { user, setUser } = useContext(AuthContext);
  const BASE_URL = "https://blogdemo-api.herokuapp.com";
  const navigate = useNavigate();
  // const Bucket = post.find((post) => post.id === Number(postID));
  useEffect(() => {
    // window.scrollTo(0, 0);
    getPost(postID).then((data) => setPost(data));
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

    return fetch(`${BASE_URL}/posts/${postID}`, {
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
        getPost(postID).then((data) => setPost(data));
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
    return fetch(`${BASE_URL}/posts/${postID}`, {
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
        getPost(postID).then((data) => setPost(data));
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
            <ArthurLink to={`/my`}>
              <Avatar src={`https://i.pravatar.cc/48?img=${post.id}`} />
            </ArthurLink>

            <CtAuthor to={`/my`}>
              {post.nickname && post.nickname ? post.nickname : "匿名"}
            </CtAuthor>

            <CtDate>{new Date(Number(post.createdAt)).toLocaleString()}</CtDate>

            <CtTitle>{post.title}</CtTitle>
            <Pic src={`https://picsum.photos/500/300/?random=${post.id} `} />
            <CtBody>{post.body}</CtBody>

            {post.editAt && (
              <EdDate>
                最後編輯時間：
                <br />
                {new Date(Number(post.editAt)).toLocaleString()}
              </EdDate>
            )}
            {user && user.id === post.userId && (
              <EditButton onClick={handleEdit}>編輯</EditButton>
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
