import React, { useState, useEffect } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useTeam } from "../Userinfo/TeamContext"; // TeamContext 사용

// 스타일 정의
const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#155a9a",
  },
}));

const Backepage = () => {
  const { teamName } = useTeam();
  const [viewMode, setViewMode] = useState("ERD"); // "ERD" 또는 "API"
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const token = sessionStorage.getItem("ACCESS_TOKEN");

  // ERD 파일 업로드 핸들러
  const handleERDUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));

    try {
      const nickName = sessionStorage.getItem("USER_NICKNAME");
      const formData = new FormData();
      formData.append("erd", uploadedFile);
      formData.append("data", JSON.stringify({
        writer: nickName,
        teamName: teamName
      }));

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/board/updatebeerd`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("ERD 파일 업로드 성공!");
      console.log("업로드 응답:", response.data);
      fetchData();
    } catch (error) {
      console.error("ERD 파일 업로드 실패:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  // API 파일 업로드 핸들러
  const handleAPIUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setPreview(URL.createObjectURL(uploadedFile));

    try {
      const nickName = sessionStorage.getItem("USER_NICKNAME");
      const formData = new FormData();
      formData.append("api", uploadedFile);
      formData.append("data", JSON.stringify({
        writer: nickName,
        teamName: teamName
      }));

      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/board/updatebeapi`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("API 파일 업로드 성공!");
      console.log("업로드 응답:", response.data);
      fetchData();
    } catch (error) {
      console.error("API 파일 업로드 실패:", error);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  // 파일 삭제 핸들러
  const handleFileDelete = async () => {
    if (!preview) {
      alert('삭제할 파일이 없습니다.');
      return;
    }

    try {
      const nickName = sessionStorage.getItem("USER_NICKNAME");
      const formData = new FormData();
      formData.append("data", JSON.stringify({
        writer: nickName,
        teamName: teamName
      }));

      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/board/${viewMode === "ERD" ? "deletebeerd" : "deletebeapi"}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          data: formData
        }
      );

      if (response.status === 200) {
        alert(`${viewMode} 파일이 성공적으로 삭제되었습니다.`);
        setPreview(null);
        fetchData();
      }
    } catch (error) {
      console.error(`${viewMode} 파일 삭제 실패:`, error);
      alert('파일 삭제 중 오류가 발생했습니다.');
    }
  };

  // 데이터 불러오기
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/board/getbe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            teamName,
          },
        }
      );

      if (response.status === 200) {
        console.log("데이터 불러오기 성공:", response.data);
        const { result } = response.data;
        setPreview(viewMode === "ERD" ? result.erd : result.api);
      }
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
      alert("데이터 불러오기 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewMode]);

  return (
    <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <StyledPaper>
            <Typography
              variant="h6"
              fontSize={45}
              align="center"
              sx={{ marginBottom: 2, color: "#555" }}
            >
              {viewMode}
            </Typography>

            <Box display="flex" justifyContent="space-between" padding={2}>
              <StyledButton
                onClick={() => setViewMode("ERD")}
                sx={{
                  backgroundColor: viewMode === "ERD" ? "#155a9a" : "#1976d2",
                }}
              >
                ERD
              </StyledButton>
              <StyledButton
                onClick={() => setViewMode("API")}
                sx={{
                  backgroundColor: viewMode === "API" ? "#155a9a" : "#1976d2",
                }}
              >
                API 명세서
              </StyledButton>
            </Box>

            <Box
              sx={{
                backgroundColor: "#d9d9d9",
                borderRadius: 1,
                height: "600px",
                margin: "0 2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              {preview ? (
                <Box position="relative" width="100%" height="100%">
                  <img
                    src={preview}
                    alt={`${viewMode} Preview`}
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleFileDelete}
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    삭제
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  파일 업로드
                  <input type="file" hidden onChange={viewMode === "ERD" ? handleERDUpload : handleAPIUpload} />
                </Button>
              )}
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Backepage;
