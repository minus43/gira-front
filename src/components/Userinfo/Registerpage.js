import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registerpage = () => {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailError(!validateEmail(value));
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(!validatePassword(value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
  };

  const memberCreate = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (emailError || passwordError) {
      alert("유효하지 않은 입력입니다.");
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/user/signup`,
        {
          email,
          nickName,
          password,
        },
        {
          headers: { "Content-type": "application/json" },
        }
      );

      if (res.status === 200) {
        alert("회원 가입 성공! 환영합니다!");
        navigate("/");
      } else {
        alert(res.data.statusMessage);
      }
    } catch (error) {
      console.error(error);
      alert("회원 가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            width: "100%",
          }}
        >
          <Typography variant="h6" gutterBottom>
            회원가입
          </Typography>
          <form onSubmit={memberCreate}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  placeholder="이메일을 입력해주세요"
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                  helperText={emailError ? "잘못된 이메일입니다." : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="nickName"
                  placeholder="닉네임을 입력해주세요"
                  fullWidth
                  variant="outlined"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm Password"
                  placeholder="비밀번호를 다시 한번 입력해주세요"
                  fullWidth
                  variant="outlined"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={
                    password && confirmPassword && password !== confirmPassword
                  }
                  helperText={
                    password && confirmPassword && password !== confirmPassword
                      ? "비밀번호가 일치하지 않습니다."
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={
                    emailError || passwordError || password !== confirmPassword
                  }
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Registerpage;
