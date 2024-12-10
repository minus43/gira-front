import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
  TextField,
  Card,
  CardActions,
} from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './Userinfo/UserContext';
import { useTeam, setTeamName } from '../components/Userinfo/TeamContext'; // TeamContext 가져오기
import axios from 'axios';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, onLogout } = useContext(AuthContext);
  const { teamName, setTeamName } = useTeam();

  const token = sessionStorage.getItem('ACCESS_TOKEN'); // 저장된 토큰 가져오기
  const [teams, setTeams] = useState([]); // 팀 목록 상태
  const [newTeamName, setNewTeamName] = useState(''); // 새로운 팀 이름
  const [showTeamList, setShowTeamList] = useState(false); // 팀 리스트 표시 여부
  const teamListRef = useRef(null); // 팀 리스트 박스 참조

  const nickName = sessionStorage.getItem('USER_NICKNAME');

  // 팀 목록 가져오기
  const fetchTeams = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/teamlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.result) {
        setTeams(res.data.result); // 응답 데이터에서 팀 목록 설정
      } else {
        console.error('팀 목록 데이터가 없습니다:', res.data);
        setTeams([]); // 팀 목록이 없을 때 초기화
      }
    } catch (error) {
      console.error('팀 목록 가져오기 실패:', error);
      setTeams([]); // 오류 발생 시 빈 배열
    }
  };

  // 팀 추가
  const addTeam = async () => {
    if (!newTeamName.trim()) return; // 팀 이름이 비어있으면 무시
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/maketeam`,
        { teamName: newTeamName, userName: nickName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTeamName(''); // 입력 필드 초기화
      fetchTeams(); // 팀 목록 갱신
    } catch (error) {
      console.error('팀 추가 실패:', error);
    }
  };

  const addnew = () => {
    addTeam();
  };

  // 팀 삭제
  const deleteTeam = async (teamName) => {
    const token = sessionStorage.getItem('ACCESS_TOKEN');
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/user/deleteteam`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            teamName,
            userName: nickName,
            userRole: '',
          },
        }
      );
      alert(`팀 "${teamName}"이(가) 삭제되었습니다.`);
      setTeamName(''); // 현재 선택된 팀 이름 초기화
      fetchTeams();
      navigate('/'); // 메인 페이지로 이동
    } catch (error) {
      console.error('팀 삭제 실패:', error);
      alert('팀 삭제 중 오류가 발생했습니다.');
    }
  };

  // 특정 팀 선택 시 팀 설정 및 상세 페이지로 이동
  const handleTeamClick = (teamName) => {
    setTeamName(teamName); // TeamContext를 통해 선택한 팀 설정
    setShowTeamList(false); // 팀 리스트 닫기
    navigate(`/team/${teamName}`, { state: { teamName } }); // 팀 이름과 함께 페이지 이동
  };

  // Team 버튼 클릭 시 팀 목록 표시
  const toggleTeamList = () => {
    if (!showTeamList) {
      fetchTeams(); // 팀 목록 불러오기
    }
    setShowTeamList((prev) => !prev); // 토글
  };

  // 외부 클릭 감지
  const handleClickOutside = (event) => {
    if (teamListRef.current && !teamListRef.current.contains(event.target)) {
      setShowTeamList(false); // 외부 클릭 시 리스트 닫기
    }
  };

  // 외부 클릭 이벤트 등록 및 해제
  useEffect(() => {
    if (showTeamList) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTeamList]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchTeams(); // 로그인 상태에서 팀 목록 불러오기
    }
  }, [isLoggedIn]);

  return (
    <AppBar position='static' color='default' sx={{ boxShadow: 1 }}>
      <Toolbar>
        {/* 로고 버튼 */}
        <IconButton
          edge='start'
          color='inherit'
          aria-label='logo'
          onClick={() => navigate('/')}
        >
          <img
            src='https://c.animaapp.com/MO0zgR1z/img/figma.svg'
            alt='Figma'
            style={{ width: 40 }}
          />
        </IconButton>

        {/* 팀 선택 및 페이지 이동 버튼 */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          {isLoggedIn && (
            <>
              {/* 팀 목록 버튼 */}
              <Box sx={{ position: 'relative' }}>
                <Button sx={{ mx: 1 }} color='primary' onClick={toggleTeamList}>
                  {teamName || 'Team'}
                </Button>
                {showTeamList && (
                  <Box
                    ref={teamListRef}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '300px',
                      backgroundColor: '#f9f9f9',
                      boxShadow: '0px 2px 10px rgba(0,0,0,0.1)',
                      zIndex: 99,
                      borderRadius: '4px',
                      padding: '10px',
                    }}
                  >
                    <Typography variant='h6' gutterBottom>
                      Team List
                    </Typography>

                    {/* 팀 목록 렌더링 */}
                    {teams.length > 0 ? (
                      teams.map((team) => (
                        <Card
                          key={team.teamName}
                          sx={{
                            marginBottom: 1,
                            boxShadow: 'none',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                          }}
                        >
                          <CardActions>
                            <Button
                              size='small'
                              onClick={() => handleTeamClick(team.teamName)}
                            >
                              {team.teamName}
                            </Button>
                            <Button
                              size='small'
                              color='error'
                              onClick={() => deleteTeam(team.teamName)}
                            >
                              삭제
                            </Button>
                          </CardActions>
                        </Card>
                      ))
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        팀 목록이 비어 있습니다.
                      </Typography>
                    )}

                    {/* 새 팀 추가 */}
                    <Box sx={{ marginTop: 2 }}>
                      <TextField
                        fullWidth
                        label='New Team Name'
                        variant='outlined'
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        sx={{ marginBottom: 1 }}
                      />
                      <Button
                        onClick={addTeam}
                        color='primary'
                        variant='contained'
                        fullWidth
                      >
                        Add Team
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* 추가 네비게이션 버튼 (팀 선택 시에만 노출) */}
              {teamName && (
                <>
                  {[
                    { path: '/Titlepage', label: 'Title' },
                    { path: '/Toolpage', label: 'Tool' },
                    { path: '/URpage', label: 'UR&WBS' },
                    { path: '/Backpage', label: 'Backend' },
                    { path: '/Frontpage', label: 'Frontend' },
                    { path: '/Resultpage', label: 'Result' },
                  ].map(({ path, label }) => (
                    <Button
                      key={path}
                      sx={{ mx: 1 }}
                      color='primary'
                      onClick={() => navigate(path)}
                    >
                      {label}
                    </Button>
                  ))}
                </>
              )}
            </>
          )}
        </Box>

        {/* 로그인 상태 버튼 */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isLoggedIn ? (
            <>
              <Button variant='outlined' onClick={onLogout}>
                Log Out
              </Button>
              <Button variant='outlined' onClick={() => navigate('/mypage')}>
                MyPage
              </Button>
            </>
          ) : (
            <>
              <Button variant='outlined' onClick={() => navigate('/login')}>
                Sign in
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
