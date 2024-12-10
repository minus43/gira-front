import React, { createContext, useContext, useState } from "react";

// Context 생성
const TeamContext = createContext();

// Context Provider 컴포넌트
export function TeamProvider({ children }) {
  const [teamName, setTeamName] = useState("Default Team"); // 팀 이름 상태 관리

  return (
    <TeamContext.Provider value={{ teamName, setTeamName }}>
      {children}
    </TeamContext.Provider>
  );
}

// Custom Hook: Context 쉽게 사용하기
export function useTeam() {
  return useContext(TeamContext);
}
