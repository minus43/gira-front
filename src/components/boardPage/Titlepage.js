import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useEffect, useContext } from "react";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import axios from "axios";
import AuthContext from "../Userinfo/UserContext";
import { useTeam } from "../Userinfo/TeamContext"; // TeamContext 사용

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows,
  padding: theme.spacing(2),
  position: "relative",
}));

const CommentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fffbfb",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows,
  padding: theme.spacing(2),
  textAlign: "center",
}));

const Titlepage = () => {
  const { teamName } = useTeam(); // Correctly extract `teamName` from context
  const [title, setTitle] = useState(""); // 입력 필드 1: 제목
  const [content, setContent] = useState(""); // 입력 필드 2: 내용
  const [textAlign, setTextAlign] = useState("left"); // 초기 정렬 상태: 좌측 정렬
  const { email, role } = useContext(AuthContext); // AuthContext 가져오기

  const token = sessionStorage.getItem("ACCESS_TOKEN"); // 저장된 토큰 가져오기
  const nickname = sessionStorage.getItem("USER_NICKNAME"); // 사용자 닉네임 가져오기

  // 서버에서 데이터 가져오기
  const jointitle = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/board/gettheme`,
        {
          params: { teamName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("불러오기 성공:", response.data);
        // response.data.result에서 데이터를 가져옴
        const themeData = response.data.result;
        setTitle(themeData.title || "제목을 입력하세요");
        setContent(themeData.content || "내용을 입력하세요");
      } else {
        console.warn("저장된 데이터가 없습니다.");
        setTitle("제목을 입력하세요");
        setContent("내용을 입력하세요");
      }
    } catch (error) {
      console.error("불러오기 실패:", error);
      alert("불러오기 중 오류가 발생했습니다.");
      setTitle("제목을 입력하세요");
      setContent("내용을 입력하세요");
    }
  };

  // 서버에 데이터 저장하기
  const savetitle = async () => {
    try {
      const data = {
        teamName, // Use `teamName` directly
        title,
        content,
        writer: nickname, // 사용자 닉네임 추가
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/board/updatetheme`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
          },
        }
      );

      console.log("저장 성공:", response.data);
      alert("저장이 완료되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    jointitle();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <StyledPaper>
            <Grid container spacing={2}>
              {/* 첫 번째 입력 필드 */}
              <Grid item xs={12}>
                <Typography
                  variant="h6"
                  fontSize={45}
                  align="center"
                  sx={{ marginBottom: 2, color: "#555" }}
                >
                  Title {/* 현재 모드 표시 */}
                </Typography>
                <input
                  style={{ width: "100%", height: "60px" }}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              {/* 정렬 버튼 */}
              <Grid item xs={12} sm={8} md={6}>
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "gray",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#e64a19" },
                      padding: "10px 20px",
                    }}
                    onClick={() => setTextAlign("left")}
                    startIcon={<FormatAlignLeftIcon />}
                  ></Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "gray",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#e64a19" },
                      padding: "10px 20px",
                    }}
                    onClick={() => setTextAlign("center")}
                    startIcon={<FormatAlignCenterIcon />}
                  ></Button>

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "gray",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#e64a19" },
                      padding: "10px 20px",
                    }}
                    onClick={() => setTextAlign("right")}
                    startIcon={<FormatAlignRightIcon />}
                  ></Button>
                </Box>
              </Grid>
              {/* 두 번째 입력 필드 */}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "400px",
                      border: "1px solid #ccc",
                      display: "flex",
                      justifyContent: textAlign,
                      padding: "10px",
                      fontSize: "16px",
                      overflow: "auto",
                    }}
                  >
                    <textarea
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        resize: "none",
                        outline: "none",
                        textAlign: textAlign,
                      }}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Box>
                </Grid>
              </Grid>
              {/* 버튼 섹션 */}
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="right"
                  gap={2}
                  sx={{ mt: 1 }}
                >
                  <Button variant="contained" onClick={savetitle}>
                    저장
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Titlepage;
