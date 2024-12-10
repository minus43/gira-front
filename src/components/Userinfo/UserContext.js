import React, { useEffect, useState } from "react";

const AuthContext = React.createContext({
  isLoggedIn: false, // 로그인 했는지 여부
  jwtToken: null, // JWT 토큰
  userRole: "", // 사용자 역할
  userEmail: "", // 사용자 이메일
  userNickname: "", // 사용자 닉네임
  isInit: false, // 초기화 여부
  onLogin: () => {}, // 로그인 함수
  onLogout: () => {}, // 로그아웃 함수
});

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jwtToken, setJwtToken] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");
    const role = sessionStorage.getItem("USER_ROLE");
    const email = sessionStorage.getItem("USER_EMAIL");
    const nickname = sessionStorage.getItem("USER_NICKNAME");

    console.log("Initializing context from sessionStorage", {
      token,
      role,
      email,
      nickname,
    });

    if (token) {
      setIsLoggedIn(true);
      setJwtToken(token);
      setUserRole(role || "");
      setUserEmail(email || "");
      setUserNickname(nickname || "");
    } else {
      console.log("No session token found. Defaulting to logged out state.");
    }
    setIsInit(true);
  }, []);

  const loginHandler = (token, role, email, nickname) => {
    console.log("Login triggered with:", { token, role, email, nickname });

    if (!token || !role || !email || !nickname) {
      console.error("필수 값이 누락되었습니다:", {
        token,
        role,
        email,
        nickname,
      });
      return;
    }

    try {
      sessionStorage.setItem("ACCESS_TOKEN", token);
      sessionStorage.setItem("USER_ROLE", role);
      sessionStorage.setItem("USER_EMAIL", email);
      sessionStorage.setItem("USER_NICKNAME", nickname);

      console.log("sessionStorage 저장 완료");

      setIsLoggedIn(true);
      setJwtToken(token);
      setUserRole(role);
      setUserEmail(email);
      setUserNickname(nickname);

      console.log("AuthContext 상태 업데이트 완료:", {
        isLoggedIn: true,
        jwtToken: token,
        userRole: role,
        userEmail: email,
        userNickname: nickname,
      });
    } catch (error) {
      console.error("sessionStorage 저장 중 오류 발생:", error);
    }
  };

  const logoutHandler = () => {
    console.log("Logout triggered");
    sessionStorage.clear();
    setIsLoggedIn(false);
    setJwtToken(null);
    setUserRole("");
    setUserEmail("");
    setUserNickname("");
  };

  return (
    <AuthContext.Provider
      value={{
        jwtToken,
        userEmail,
        userNickname,
        isLoggedIn,
        userRole,
        isInit,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
