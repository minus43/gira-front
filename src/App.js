import "./App.css";
import React from "react";
import Mainpage from "./components/Mainpage";
import { Routes, Route } from "react-router-dom";
import Loginpage from "./components/Userinfo/Loginpage";
import Registerpage from "./components/Userinfo/Registerpage";
import Mypage from "./components/Userinfo/Mypage";
import Header from "./components/Header";
import Backpage from "./components/boardPage/Backpage";
import Frontpage from "./components/boardPage/Frontpage";
import Resultpage from "./components/boardPage/Resultpage";
import Teampage from "./components/boardPage/Teampage";
import Titlepage from "./components/boardPage/Titlepage";
import Toolpage from "./components/boardPage/Toolpage";
import URpage from "./components/boardPage/URpage";
import { AuthContextProvider } from "./components/Userinfo/UserContext";
import { TeamProvider } from "./components/Userinfo/TeamContext";
import JoinTeamPage from './components/JoinTeamPage';

function App() {
  return (
    <>
      {/* Auth와 Team Context를 함께 사용 */}
      <AuthContextProvider>
        <TeamProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Mainpage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/Backpage" element={<Backpage />} />
            <Route path="/Frontpage" element={<Frontpage />} />
            <Route path="/Resultpage" element={<Resultpage />} />
            <Route path="/Teampage" element={<Teampage />} />
            <Route path="/team/:teamName" element={<Teampage />} />
            <Route path="/Titlepage" element={<Titlepage />} />
            <Route path="/Toolpage" element={<Toolpage />} />
            <Route path="/URpage" element={<URpage />} />
            <Route path="/join-team" element={<JoinTeamPage />} />
          </Routes>
        </TeamProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
