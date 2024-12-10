import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./UserContext";

const Mypage = () => {
  const [email, setEmail] = useState();
  const [nickname, setNickname] = useState();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { userEmail, userRole, userNickname } = useContext(AuthContext);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = sessionStorage.getItem("ACCESS_TOKEN"); // 저장된 토큰 가져오기

  useEffect(() => {});

  const deleteHandler = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/user/delete`, {
        headers: {
          Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
        },
      });
      setMessage("계정이 삭제되었습니다.");
    } catch (error) {
      alert("계정 삭제를 실패했습니다.");
    }
  };

  const nicknameModifyHandler = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user/modifyuser`,
        { nickName: nickname, password: password },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      alert("닉네임 수정 완료!");
    } catch (error) {
      alert("닉네임 수정 실패했습니다.");
    }
  };

  const passwordModifyHandler = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/user/modifyuser`,
        { nickName: nickname, password: password },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 헤더에 토큰 추가
            "Content-Type": "application/json",
          },
        }
      );
      setMessage(response.data.message);
      alert("비밀번호 수정 완료!");
    } catch (error) {
      alert("비밀번호 수정 실패했습니다");
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);
    setPasswordError(!validatePassword(password));
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 296,
            left: "50%",
            transform: "translateX(-50%)",
            p: 3,
            width: 272,
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">Nickname</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={nickname}
                placeholder={`${userNickname}`}
                onChange={(e) => setNickname(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={nicknameModifyHandler}
              >
                닉네임 수정
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Password</Typography>
              <TextField
                label="Password"
                placeholder="비밀번호를 입력해주세요"
                fullWidth
                variant="outlined"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                helperText={
                  passwordError
                    ? "비밀번호는 최소 8자, 소문자, 숫자 및 특수 문자를 포함해야 합니다."
                    : ""
                }
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={passwordModifyHandler}
              >
                비밀번호 수정
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={deleteHandler}
              >
                계정 삭제
              </Button>
            </Grid>
            {message && (
              <Grid item xs={12}>
                <Typography color="error">{message}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Mypage;
