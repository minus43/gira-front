import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const JoinTeamPage = () => {
  const [teamInfo, setTeamInfo] = useState({ teamName: '', userName: '' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const teamName = searchParams.get('teamName');
    const userName = searchParams.get('userName');
    if (teamName && userName) {
      setTeamInfo({ teamName, userName });
    }
  }, [searchParams]);

  const handleJoinTeam = async () => {
    try {
      const token = sessionStorage.getItem('ACCESS_TOKEN');
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/jointeam`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            teamName: teamInfo.teamName,
            userEmail: teamInfo.userName
          }
        }
      );
      alert('팀 가입이 완료되었습니다!');
      navigate('/team/' + teamInfo.teamName);
    } catch (error) {
      console.error('Failed to join team:', error);
      alert('팀 가입에 실패했습니다. ' + (error.response?.data?.message || ''));
    }
  };

  return (
    <div>
      <h2>팀 가입</h2>
      <p>팀 이름: {teamInfo.teamName}</p>
      <p>사용자: {teamInfo.userName}</p>
      <button onClick={handleJoinTeam}>팀 가입하기</button>
    </div>
  );
};

export default JoinTeamPage; 