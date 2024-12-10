import { CheckBox as CheckBoxIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./UserContext";
import { jwtDecode } from "jwt-decode";
import axios, { HttpStatusCode } from "axios";

const Loginpage = () => {
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [autoSignIn, setAutoSignIn] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { onLogin } = useContext(AuthContext);
  console.log("AuthContext onLogin 확인:", onLogin);

  // 이메일 유효성 검사 패턴
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(""); // Clear error on change

    // 이메일 유효성 검사
    if (!emailPattern.test(value)) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
  };

  const doLogin = async () => {
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("정확한 이메일을 입력하세요.");
      return;
    }

    if (!password) {
      setPasswordError("비밀번호를 입력하세요.");
      return;
    }

    const loginData = { email, nickName, password };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/signin`,
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("====================================");
      console.log("res: ", res);
      console.log("====================================");
      console.log("로그인 응답 헤더:", res.headers);

      // 응답 헤더에서 데이터 추출 (키 이름 소문자로 접근)
      const token = res.headers["authorization"]?.split(" ")[1]; // Bearer 토큰
      const role = res.headers["role"]; // 사용자 역할
      const nickname = res.headers["nickname"]; // 닉네임
      const userEmail = res.headers["email"]; // 이메일
      const teamName = res.headers["teamName"]; //팀이름

      console.log("====================================");
      console.log(token, role, nickname, userEmail);
      console.log("====================================");

      if (res.status === 200) {
        alert("로그인 성공!");
        console.log("onLogin 호출", { token, role, userEmail, nickname });

        onLogin(token, role, userEmail, nickname);
        console.log(token, role, userEmail, nickname);

        navigate("/");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      const errorMessage =
        error.response?.data?.statusMessage || "로그인 실패!";
      setPasswordError(errorMessage);
      alert("로그인 실패: " + errorMessage);
    }
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
              <Typography variant="body1">Email</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일을 입력하세요"
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Nickname</Typography>
              <TextField
                fullWidth
                variant="outlined"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">Password</Typography>
              <TextField
                fullWidth
                variant="outlined"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요"
                error={!!passwordError}
                helperText={passwordError}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<CheckBoxIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    checked={autoSignIn}
                    onChange={(e) => setAutoSignIn(e.target.checked)}
                  />
                }
                label="Auto Sign In"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={doLogin}
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Button fullWidth variant="contained" color="primary">
                    Naver
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button fullWidth variant="contained" color="primary">
                    Kakao
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button fullWidth variant="contained" color="primary">
                    Github
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}></Grid>
            {message && (
              <Grid item xs={12}>
                <Typography>{message}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Loginpage;
