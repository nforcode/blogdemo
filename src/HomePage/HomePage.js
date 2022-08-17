import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { getPosts } from "../WebApi";
import Pagination from "./Pagination/Pagination";
const MainPage = styled.div`
  padding: 10px;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  background: black;
  color: white;

  @media screen and (max-width: 992px) {
    background: gray;
    width: auto;
  }
`;
const PostContainer = styled.div`
  margin: 0 auto;
  border-bottom: 1px solid silver;
  position: relative;
`;
const LinkPic = styled(Link)`
  height: 200px;
  width: 300px;
  display: block;
  @media screen and (max-width: 992px) {
    margin-top: 15px;
    margin-left: auto;
    margin-right: auto;
  }
`;
const Pic = styled.img``;

const PostTitle = styled(Link)`
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
const PostDate = styled.div`
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

let PageSize = 10;
function Post({ post }) {
  var moment = require("moment");
  moment().format();

  return (
    <PostContainer>
      <LinkPic to={`/content/${post.id}`}>
        <Pic src={`https://picsum.photos/300/200/?random=${post.id} `} />
      </LinkPic>
      <PostTitle to={`/content/${post.id}`}>{post.title}</PostTitle>

      <PostDate>{moment(Number(post.createdAt)).format("YYYY/MM/DD")}</PostDate>
    </PostContainer>
  );
}
export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getPosts().then((posts) => setPosts(posts));
  }, []);
  return (
    <MainPage>
      {posts &&
        currentTableData.map((post) => <Post post={post} key={post.id} />)}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={posts.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </MainPage>
  );
}

Post.propTypes = {
  post: PropTypes.object,
};
