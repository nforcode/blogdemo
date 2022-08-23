import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getPosts } from "../WebApi";
import Pagination from "./Pagination/Pagination";
import Post from "./Post";
const MainPage = styled.div`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;

  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const Footer = styled.div`
  height: 20px;
`;
let PageSize = 10;

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
      <Footer />
    </MainPage>
  );
}
