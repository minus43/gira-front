import React, { useState, useEffect } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { Container, styled } from "@mui/system";
import axios from "axios";
import { useTeam } from "../Userinfo/TeamContext";

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f2f2f2",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows,
  padding: theme.spacing(2),
}));

const Toolpage = () => {
  const { teamName } = useTeam();
  const userName = sessionStorage.getItem("USER_NICKNAME");

  // 상태 정의
  const [toolFields, setToolFields] = useState([]);
  const [originalTools, setOriginalTools] = useState([]);
  const [newTools, setNewTools] = useState([]);
  const [removedToolIds, setRemovedToolIds] = useState([]);
  const [modifiedTools, setModifiedTools] = useState([]);

  // 도구 필드 변경 처리
  const handleToolFieldChange = (index, field, value) => {
    const updatedFields = [...toolFields];
    const tool = updatedFields[index];
    updatedFields[index] = { 
      ...tool, 
      [field]: value,
      writer: userName,
      teamName: teamName
    };
    setToolFields(updatedFields);

    if (tool.id) {
      const originalTool = originalTools.find(t => t.id === tool.id);
      const hasChanged = originalTool && (
        originalTool.type !== updatedFields[index].type ||
        originalTool.name !== updatedFields[index].name ||
        originalTool.version !== updatedFields[index].version
      );

      if (hasChanged) {
        setModifiedTools(prev => {
          const filtered = prev.filter(t => t.id !== tool.id);
          return [...filtered, updatedFields[index]];
        });
      }
    } else {
      setNewTools(prev => {
        return prev.map((t, i) => {
          if (i === index - originalTools.length) {
            return updatedFields[index];
          }
          return t;
        });
      });
    }
  };

  // 새 도구 추가
  const addToolField = () => {
    const newTool = {
      type: "",
      name: "",
      version: "",
      writer: userName,
      teamName: teamName
    };
    setToolFields(prev => [...prev, newTool]);
    setNewTools(prev => [...prev, { ...newTool }]);
  };

  // 도구 삭제
  const handleRemoveTool = (index) => {
    const tool = toolFields[index];
    if (tool.id) {
      setRemovedToolIds(prev => [...prev, tool.id]);
      setModifiedTools(prev => prev.filter(t => t.id !== tool.id));
    } else {
      const newToolIndex = index - originalTools.length;
      setNewTools(prev => prev.filter((_, i) => i !== newToolIndex));
    }
    setToolFields(prev => prev.filter((_, i) => i !== index));
  };

  // 전체 저장
  const handleSaveAll = async () => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");
    const payload = {
      addTool: newTools.map(tool => ({
        ...tool,
        teamName
      })),
      removeTool: removedToolIds.map(id => ({
        id,
        teamName
      })),
      editTool: modifiedTools.map(tool => ({
        ...tool,
        teamName
      }))
    };

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/board/updatetool`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.statusCode === 200) {
        alert("저장 성공!");
        joinToolPage();
      } else {
        alert(response.data.statusMessage || "저장 실패!");
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 데이터 로드
  const joinToolPage = async () => {
    const token = sessionStorage.getItem("ACCESS_TOKEN");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/board/gettool`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { teamName }
        }
      );

      if (response.data.statusCode === 200 && response.data.result) {
        console.log("설정할 데이터:", response.data.result);
        setToolFields(response.data.result);
        setOriginalTools(response.data.result);
        setNewTools([]);
        setRemovedToolIds([]);
        setModifiedTools([]);
      }
    } catch (error) {
      console.error("불러오기 실패:", error);
      alert("불러오기 중 문제가 발생했습니다.");
    }
  };

  useEffect(() => {
    joinToolPage();
  }, [teamName]);

  return (
    <Container maxWidth="lg" sx={{ height: "1024px", position: "relative" }}>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" fontSize={45} align="center" sx={{ marginBottom: 2, color: "#555" }}>
              TOOL
            </Typography>
            <Box sx={{ width: "100%", height: "600px", overflowY: "auto", padding: 2 }}>
              {toolFields.map((field, index) => (
                <Box
                  key={index}
                  display="grid"
                  gridTemplateColumns="1fr 1fr 2fr 1fr auto"
                  gap={2}
                  alignItems="center"
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <TextField
                    fullWidth
                    label="유형"
                    value={field.type || ""}
                    onChange={(e) => handleToolFieldChange(index, "type", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="이름"
                    value={field.name || ""}
                    onChange={(e) => handleToolFieldChange(index, "name", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="버전"
                    value={field.version || ""}
                    onChange={(e) => handleToolFieldChange(index, "version", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="작성자"
                    value={field.writer || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleRemoveTool(index)}
                  >
                    삭제
                  </Button>
                </Box>
              ))}
              <Button variant="outlined" onClick={addToolField}>
                + 추가
              </Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, p: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveAll}
                disabled={!modifiedTools.length && !newTools.length && !removedToolIds.length}
              >
                저장
              </Button>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Toolpage;
