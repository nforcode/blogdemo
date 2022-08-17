import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts";
import { setAuthToken, getAuthToken } from "../utils";
import { getMe } from "../WebApi";
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 60px;
  position: fixed;
  background-color: white;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  @media screen and (max-width: 992px) {
    height: 40px;
  }
`;
const Logo = styled.h1`
  color: green;
  margin-left: 15px;
  font-size: 2.5rem;
  font-family: fantasy;
  text-decoration: none;
  @media screen and (max-width: 992px) {
    display: none;
  }
`;
const MLogo = styled.h1`
  color: green;
  margin-left: 15px;
  font-size: 2.5rem;
  font-family: fantasy;
  text-decoration: none;
  position: absolute;
  top: 10px;
  @media screen and (min-width: 993px) {
    display: none;
  }
`;
const NavBarList = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  position: absolute;
  top: 12px;
  right: 10px;
  @media screen and (max-width: 992px) {
    font-size: 1.2rem;
    top: 10px;
  }
`;
const NavIndex = styled(Link)`
  padding: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  cursor: pointer;
  color: black;
  text-decoration: none;
  ${(props) => props.$active && `background:rgba(0,0,0,0.1);`}
  @media screen and (max-width: 992px) {
    display: none;
  }
`;
const Nav = styled(Link)`
  padding: 10px;
  margin-right: 15px;
  box-sizing: border-box;
  cursor: pointer;
  color: black;
  text-decoration: none;
  ${(props) => props.$active && `background:rgba(0,0,0,0.1);`}
`;
const Post = styled(Link)`
  background-color: orange;
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
  color: black;
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
          <Nav to="/my" $active={location.pathname === "/my"}>
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
    </Container>
  );
}
