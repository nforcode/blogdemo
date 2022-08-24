import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { getPosts, getUser } from "../WebApi";
import { Link } from "react-router-dom";
import Pagination from "./Pagination/Pagination";
import Post from "./Post";
const MainPage = styled.div`
  padding: 0 15px;
  width: 840px;
  height: 100%;
  margin: 0 auto;
  color: black;
  position: relative;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const Recommend = styled.div`
  position: absolute;
  top: 0px;
  right: -20px;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 1079px) {
    display: none;
  }
`;
const P = styled.p`
  margin-bottom: 20px;
`;
const Wrap = styled.div`
  position: relative;
  margin-top: 10px;
`;
const ArthurLink = styled(Link)`
  text-decoration: none;
`;
const Avatar = styled.img`
  display: inline-block;
  height: 48px;
  width: 48px;
  border-radius: 48px;
`;
const Arthurs = styled.span`
  display: inline-block;
  position: absolute;
  top: 12px;
  left: 55px;
  color: black;
  font-weight: 600;
`;
const Footer = styled.div`
  height: 20px;
`;
let PageSize = 10;

const RandomUser = ({ user }) => {
  return (
    <Wrap>
      <ArthurLink to={`/user/${user.id}`}>
        <Avatar
          src={`https://i.pravatar.cc/48?img=${Math.floor(Math.random() * 50)}`}
        />
        <Arthurs>{user.nickname}</Arthurs>
      </ArthurLink>
    </Wrap>
  );
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [arthurs, setArthurs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getPosts().then((posts) => setPosts(posts));
    getUser().then((users) => {
      let countArr = users;
      const randomArthur = (() => {
        let newArray = [];
        for (let i = 0; i < 5; i++) {
          let n = Math.floor(Math.random() * countArr.length);
          newArray.push(countArr[n]);
          countArr.splice(n, 1);
        }
        return newArray;
      })();

      return setArthurs(randomArthur);
    });
  }, []);

  return (
    <MainPage>
      {posts &&
        currentTableData.map((post) => <Post post={post} key={post.id} />)}
      <Recommend>
        <P>推薦作者</P>
        {arthurs &&
          arthurs.map((user) => <RandomUser user={user}></RandomUser>)}
      </Recommend>
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
