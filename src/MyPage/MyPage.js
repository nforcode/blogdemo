import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { arthurPost } from "../WebApi";
import Post from "../HomePage/Post";
import Pagination from "../HomePage/Pagination/Pagination";
const MyMainPage = styled.div`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;

  @media screen and (max-width: 767px) {
    width: auto;
  }
`;

const MyErrorMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: red;
`;

const MyFooter = styled.div`
  height: 20px;
`;
let PageSize = 10;
export default function MyPage() {
  const [posts, setPosts] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);
  const arthurID = window.location.pathname.toString().split("/").pop();

  useEffect(() => {
    window.scrollTo(0, 0);

    arthurPost(arthurID)
      .then((posts) => setPosts(posts))
      .catch((err) => {
        setApiError(err.message);
      });
  }, [arthurID]);
  return (
    <MyMainPage>
      {posts &&
        currentTableData.map((post) => <Post post={post} key={post.id} />)}
      {posts.length === 0 && (
        <MyErrorMessage style={{ color: "black" }}>
          點選發文來張貼你的第一篇文章吧
        </MyErrorMessage>
      )}
      {apiError && (
        <MyErrorMessage>somthing wrong.{apiError.toString()}</MyErrorMessage>
      )}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={posts.length}
        pageSize={PageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <MyFooter />
    </MyMainPage>
  );
}

Post.propTypes = {
  post: PropTypes.object,
};
