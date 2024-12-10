import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { Send, Delete } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import { useTeam } from "../Userinfo/TeamContext"; // TeamContext 사용
import axios from "axios";

const Teampage = () => {
  const { teamName: paramTeamName } = useParams(); // URL에서 팀 이름 가져오기
  const { teamName, setTeamName } = useTeam(); // 전역 상태 사용
  const navigate = useNavigate();

  const [teamList, setTeamList] = useState([]); // 전체 팀 목록
  const [members, setMembers] = useState([]); // 선택된 팀의 멤버
  const [isLoading, setIsLoading] = useState(true);

  const token = sessionStorage.getItem("ACCESS_TOKEN"); // 저장된 토큰 가져오기

  // 서버에서 팀 정보를 가져와 상태 초기화
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/teamlist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTeamList(response.data);

        const currentTeam = response.data.find(
          (team) => team.teamName === paramTeamName
        );

        if (currentTeam) {
          setTeamName(currentTeam.teamName); // 전역 상태에 팀 이름 설정
          setMembers(currentTeam.members || []);
        } else if (response.data.length > 0) {
          navigate(`/team/${response.data[0].teamName}`);
        }
      } catch (error) {
        console.error("Failed to fetch team info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamInfo();
  }, [paramTeamName, setTeamName, token, navigate]);

  // 이메일 초대 기능
  const sendEmailToMember = async (email) => {
    if (!email.trim()) {
      alert("유효한 이메일을 작성해주세요");
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/inviteteam`,
        {
          address: email,
          teamName: teamName
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(`Invitation sent to ${email}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("이메일전송 실패.");
    }
  };

  // 멤버 추가
  const addMemberField = () => {
    setMembers([...members, { email: "" }]);
  };

  // 멤버 삭제
  const deleteMemberField = (index) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  // 이메일 입력 처리
  const handleEmailChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].email = value;
    setMembers(updatedMembers);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{ height: "1024px", position: "relative", padding: 10 }}
    >
      <Grid
        container
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "#f2f2f2",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {/* 왼쪽: 팀 정보 */}
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
        >
          <Avatar
            src="/3d-avatar-22.png"
            sx={{
              width: 264,
              height: 264,
              marginBottom: 4,
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: "bold", marginBottom: 4 }}>
            {teamName || "No Team Selected"}
          </Typography>
        </Grid>

        {/* 오른쪽: 멤버 목록 */}
        <Grid
          item
          xs={6}
          sx={{
            padding: 4,
            bgcolor: "#f2f2f2",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <Box
            sx={{
              maxHeight: 500,
              display: "flex",
              flexDirection: "column",
              overflowY: members.length > 5 ? "auto" : "visible",
              padding: 2,
              border: "1px solid #ccc",
              borderRadius: "8px",
              bgcolor: "#ffffff",
            }}
          >
            {members.map((field, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                gap={2}
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "8px",
                  marginBottom: "8px",
                }}
              >
                <TextField
                  label="Email"
                  variant="outlined"
                  value={field.email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  fullWidth
                />
                <IconButton
                  color="primary"
                  onClick={() => sendEmailToMember(field.email)}
                  sx={{
                    width: 56,
                    height: 56,
                  }}
                >
                  <Send />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => deleteMemberField(index)}
                  sx={{
                    width: 56,
                    height: 56,
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={addMemberField}
              sx={{ marginTop: 2 }}
            >
              + Add Member
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Teampage;
