import React, { useState, useEffect } from "react";
import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";
import { useTeam } from "../Userinfo/TeamContext";

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#d9d9d9",
  boxShadow: "0px 4px 4px #00000040",
  borderRadius: theme.shape.borderRadius,
  width: "100px",
  height: "50px",
  fontFamily: "Inter-Regular, Helvetica",
  fontSize: "16px",
  textAlign: "center",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
  boxShadow: "0px 4px 4px #00000040",
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
}));

const Frontpage = () => {
  const { teamName } = useTeam();
  const nickname = sessionStorage.getItem("nickname");
  const [frontImage, setFrontImage] = useState(null);
  const token = sessionStorage.getItem("ACCESS_TOKEN");

  const getFrontPage = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/board/getfe`,
        {
          params: { teamName },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.statusCode === 200) {
        setFrontImage(res.data.result.wireframe);
      }
    } catch (error) {
      console.error("불러오기 실패:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        const jsonData = {
          teamName: teamName  // writer 제거
        };
        
        formData.append('data', JSON.stringify(jsonData));
        formData.append('wireframe', file);
        
        const response = await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/board/updatefe`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          getFrontPage();  // 성공 시 이미지 새로고침
        }
      } catch (error) {
        alert("업로드 실패: " + (error.response?.data?.statusMessage || error.message));
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      const formData = new FormData();
      const jsonData = {
        writer: nickname,  // writer 필요
        teamName: teamName
      };
      
      formData.append('data', JSON.stringify(jsonData));

      const response = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/board/deletefewf`,
        {
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        getFrontPage();  // 성공 시 이미지 새로고침
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 실패: " + (error.response?.data?.statusMessage || error.message));
    }
  };

  useEffect(() => {
    if (teamName && token) {
      getFrontPage();
    }
  }, [teamName, token]);

  return (
    <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <StyledPaper>
            <Typography fontSize={45} align="center">
              Front End
            </Typography>

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
                position: "relative",
              }}
            >
              {frontImage ? (
                <>
                  <img
                    src={frontImage}
                    alt="Front"
                    style={{ 
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleImageDelete}
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    삭제
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  component="label"
                  sx={{ backgroundColor: "#1976d2", color: "#fff" }}
                >
                  이미지 업로드
                  <input 
                    type="file" 
                    hidden 
                    onChange={handleImageUpload}
                    accept="image/*" 
                  />
                </Button>
              )}
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Frontpage;