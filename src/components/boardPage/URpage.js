import React, { useState, useEffect } from 'react';
import { Container, Grid, Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useTeam } from '../Userinfo/TeamContext';

const URpage = () => {
  const { teamName } = useTeam();
  const userName = sessionStorage.getItem("USER_NICKNAME");

  const [urFields, setUrFields] = useState([]);
  const [originalUrs, setOriginalUrs] = useState([]);
  const [newUrs, setNewUrs] = useState([]);
  const [removedUrIds, setRemovedUrIds] = useState([]);
  const [modifiedUrs, setModifiedUrs] = useState([]);

  const joinUrPage = async () => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/board/getur`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { teamName }
        }
      );

      if (response.data.statusCode === 200) {
        setUrFields(response.data.result);
        setOriginalUrs(response.data.result);
        setNewUrs([]);
        setRemovedUrIds([]);
        setModifiedUrs([]);
      }
    } catch (error) {
      console.error("불러오기 실패:", error);
    }
  };

  const handleUrFieldChange = (index, field, value) => {
    const updatedFields = [...urFields];
    const ur = updatedFields[index];
    
    const fieldValue = field === 'deadline' ? `${value}T23:59:59` : value;
    
    updatedFields[index] = { 
      ...ur, 
      [field]: fieldValue,
      teamName,
      writer: userName
    };
    setUrFields(updatedFields);

    if (ur.id) {
      setModifiedUrs(prev => {
        const filtered = prev.filter(t => t.id !== ur.id);
        return [...filtered, { ...updatedFields[index], writer: userName }];
      });
    } else {
      setNewUrs(prev => {
        const newPrev = [...prev];
        const newUrIndex = index - originalUrs.length;
        if (newUrIndex >= 0) {
          newPrev[newUrIndex] = { ...updatedFields[index], writer: userName };
        }
        return newPrev;
      });
    }
  };

  const addUrField = () => {
    const today = new Date().toISOString().split('T')[0];
    const newUr = {
      name: "",
      content: "",
      deadline: `${today}T23:59:59`,
      manager: "",
      teamName,
      writer: userName
    };
    setUrFields(prev => [...prev, newUr]);
    setNewUrs(prev => [...prev, newUr]);
  };

  const handleRemoveUr = (index) => {
    const ur = urFields[index];
    if (ur.id) {
      setRemovedUrIds(prev => [...prev, ur.id]);
    } else {
      const newUrIndex = index - originalUrs.length;
      setNewUrs(prev => prev.filter((_, i) => i !== newUrIndex));
    }
    setUrFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAll = async () => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");
    
    const payload = {
      addUR: newUrs,
      removeUR: removedUrIds.map(id => ({ id })),
      editUR: modifiedUrs
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/board/updateur`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.statusCode === 200) {
        alert("저장 성공!");
        joinUrPage();
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    joinUrPage();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontSize={45} align="center" sx={{ marginBottom: 2, color: "#555" }}>
              UR & WBS
            </Typography>
            <Box sx={{ width: "100%", height: "600px", overflowY: "auto", padding: 2 }}>
              {urFields.map((field, index) => (
                <Box key={index} display="grid" gridTemplateColumns="1fr 1fr 2fr 1fr 1fr auto" gap={2} alignItems="center"
                  sx={{ border: "1px solid #ccc", borderRadius: "8px", padding: "8px", marginBottom: "8px" }}>
                  <TextField fullWidth label="요구사항 이름" value={field.name || ""} onChange={(e) => handleUrFieldChange(index, "name", e.target.value)} />
                  <TextField fullWidth label="요구사항 내용" value={field.content || ""} onChange={(e) => handleUrFieldChange(index, "content", e.target.value)} />
                  <TextField fullWidth type="date" label="기한" value={field.deadline ? field.deadline.split('T')[0] : ""} InputLabelProps={{ shrink: true }} onChange={(e) => handleUrFieldChange(index, "deadline", e.target.value)} />
                  <TextField fullWidth label="작성자" value={field.writer || ""} InputProps={{ readOnly: true }} />
                  <TextField fullWidth label="담당자" value={field.manager || ""} onChange={(e) => handleUrFieldChange(index, "manager", e.target.value)} />
                  <Button variant="outlined" color="error" onClick={() => handleRemoveUr(index)}>삭제</Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addUrField}>+ 추가</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, p: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSaveAll}>
                저장
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default URpage;
