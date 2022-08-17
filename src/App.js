import React, { useState } from "react";
import styled from "styled-components";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import HomePage from "./HomePage/HomePage";
import NavBar from "./NavBar/NavBar";
import Content from "./HomePage/Content";
import NewPage from "./NewPage/NewPage";
import MyPage from "./MyPage/MyPage";
import RegPage from "./RegPage/RegPage";
import EditPage from "./MyPage/EditPage";
import { AuthContext } from "./contexts";

//components
const Root = styled.div`
  padding-top: 60px;
  font-size: 20px;
`;
//function
function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Root>
        <Router>
          <NavBar />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="my" element={<MyPage />} />
            <Route path="posts/:id" element={<EditPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="reg" element={<RegPage />} />
            <Route path="new" element={<NewPage />} />
            <Route path="content/:id" element={<Content />} />
          </Routes>
        </Router>
      </Root>
    </AuthContext.Provider>
  );
}

export default App;
