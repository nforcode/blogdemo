import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts";
import { setAuthToken, getAuthToken } from "../utils";
import { getMe } from "../WebApi";
const Container = styled.div`
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  position: fixed;
  background-color: black;
  color: White;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  @media screen and (max-width: 767px) {
    height: 50px;
  }
`;
const Wrap = styled.div`
  width: 840px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  @media screen and (max-width: 767px) {
    width: auto;
  }
`;
const Logo = styled.h1`
  display: inline;
  color: white;
  margin-left: 15px;
  font-size: 2.4rem;
  font-family: fantasy;
  text-decoration: none;
  position: absolute;
  top: 10px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;
const MLogo = styled.h1`
  display: none;
  @media screen and (max-width: 767px) {
    display: inline;
    color: white;
    margin-left: 15px;
    font-size: 2.4rem;
    font-family: fantasy;
    text-decoration: none;
    position: absolute;
    top: 2px;
  }
`;
const NavBarList = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 12px;
  right: -15px;
  @media screen and (max-width: 767px) {
    top: 5px;
  }
`;
const NavIndex = styled(Link)`
  padding: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  cursor: pointer;
  color: white;
  text-decoration: none;
  ${(props) =>
    props.$active && `background:rgba(255,255,255,0.3); border-radius:10px;`}
  @media screen and (max-width: 767px) {
    display: none;
  }
`;
const Nav = styled(Link)`
  padding: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  cursor: pointer;
  color: white;
  text-decoration: none;
  ${(props) =>
    props.$active && `background:rgba(255,255,255,0.3); border-radius:10px;`}
`;
const Post = styled(Link)`
  background-color: #0072e3;
  margin-right: 30px;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  text-decoration: none;
`;
const Logout = styled.div`
  padding: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  cursor: pointer;
  color: white;
  text-decoration: none;
`;
export default function NavBar() {
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [displaylogin, setDisplaylogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAuthToken() === "null") {
      setDisplaylogin(true);
      setAuthToken(null);
    } else {
      getMe().then((response) => {
        if (response.ok !== 1) {
          setDisplaylogin(true);
          setAuthToken(null);
        }
        setUser(response.data);
      });
    }
  }, [setUser, setDisplaylogin]);
  const handleLogout = () => {
    setDisplaylogin(true);
    setUser(null);
    setAuthToken(null);
    navigate("/");
  };
  return (
    <Container>
      <Wrap>
        <Logo as={Link} to="/">
          NBLog
        </Logo>
        <MLogo as={Link} to="/">
          N
        </MLogo>
        <NavBarList>
          <NavIndex to="/" $active={location.pathname === "/"}>
            首頁
          </NavIndex>
          {user && (
            <Nav
              to={`/user/${user.id}`}
              $active={location.pathname === `/user/${user.id}`}
            >
              我的文章
            </Nav>
          )}
          {!user && displaylogin && (
            <Nav to="/login" $active={location.pathname === "/login"}>
              登入
            </Nav>
          )}
          {!user && displaylogin && (
            <Nav to="/reg" $active={location.pathname === "/reg"}>
              註冊
            </Nav>
          )}
          {user && <Logout onClick={handleLogout}>登出</Logout>}

          {user && (
            <Post to="/new" $active={location.pathname === "/new"}>
              發文
            </Post>
          )}
        </NavBarList>
      </Wrap>
    </Container>
  );
}
