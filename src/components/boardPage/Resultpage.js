import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useTeam } from '../Userinfo/TeamContext';
import axios from 'axios';

const Resultpage = () => {
  const { teamName } = useTeam();
  const token = sessionStorage.getItem('ACCESS_TOKEN');
  
  const [themeData, setThemeData] = useState(null);
  const [toolData, setToolData] = useState([]);
  const [urData, setUrData] = useState([]);
  const [backData, setBackData] = useState(null);
  const [frontData, setFrontData] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Theme 데이터
        const themeRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/board/gettheme?teamName=${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (themeRes.data.statusCode === 200) {
          setThemeData(themeRes.data.result);
        }

        // 2. Tool 데이터
        const toolRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/board/gettool?teamName=${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (toolRes.data.statusCode === 200) {
          setToolData(toolRes.data.result);
        }

        // 3. UR 데이터
        const urRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/board/getur?teamName=${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (urRes.data.statusCode === 200) {
          setUrData(urRes.data.result);
        }

        // 4. Backend 데이터
        const backRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/board/getbe?teamName=${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (backRes.data.statusCode === 200) {
          setBackData(backRes.data.result);
        }

        // 5. Frontend 데이터
        const frontRes = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/board/getfe?teamName=${teamName}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (frontRes.data.statusCode === 200) {
          setFrontData(frontRes.data.result);
        }

      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    if (teamName && token) {
      fetchAllData();
    }
  }, [teamName, token]);

  return (
    <Box sx={{ backgroundColor: "white", display: "flex", justifyContent: "center", width: "100%" }}>
      <Box sx={{ backgroundColor: "white", width: 1440, height: 1024, position: "relative" }}>
        <Paper sx={{ 
          width: 1200, 
          height: 800, 
          position: "absolute", 
          top: 100, 
          left: 120,
          backgroundColor: "#f2f2f2",
          borderRadius: 2,
          boxShadow: "0px 4px 4px #00000040",
          padding: 4,
          overflowY: "auto"
        }}>
          <Typography variant="h3" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 4 }}>
            Project Result "{teamName}"
          </Typography>

          {/* 1. Theme Section */}
          {themeData && (
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, boxShadow: 1, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>프로젝트 주제</Typography>
              <Typography variant="h6">주제: {themeData.title}</Typography>
              <Typography sx={{ mt: 1, mb: 2 }}>내용: {themeData.content}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                작성자: {themeData.writer} | 
                작성일: {new Date(themeData.regDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* 2. Tool Section */}
          <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, boxShadow: 1, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>개발 도구</Typography>
            {toolData.map((tool, index) => (
              <Box key={tool.id} sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: index !== toolData.length - 1 ? '1px solid #eee' : 'none' 
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  이름: {tool.name} | 종류: {tool.type}
                </Typography>
                <Typography variant="body2">버전: {tool.version}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                  작성자: {tool.writer} | 
                  작성일: {new Date(tool.regDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 3. UR Section */}
          <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, boxShadow: 1, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>요구사항</Typography>
            {urData.map((ur, index) => (
              <Box key={ur.id} sx={{ 
                mb: 2, 
                pb: 2, 
                borderBottom: index !== urData.length - 1 ? '1px solid #eee' : 'none' 
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>요구사항: {ur.name}</Typography>
                <Typography sx={{ mb: 1 }}>내용: {ur.content}</Typography>
                <Typography variant="body2">담당자: {ur.manager}</Typography>
                <Typography variant="body2">마감일: {new Date(ur.deadline).toLocaleDateString()}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  작성자: {ur.writer} | 
                  작성일: {new Date(ur.regDate).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* 4. Backend Section */}
          {backData && (
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, boxShadow: 1, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>Backend</Typography>
              {backData.erd && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>ERD</Typography>
                  <img src={backData.erd} alt="ERD" style={{ maxWidth: '100%' }} />
                </Box>
              )}
              {backData.api && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>API</Typography>
                  <img src={backData.api} alt="API" style={{ maxWidth: '100%' }} />
                </Box>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                작성자: {backData.writer} | 
                작성일: {new Date(backData.regDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}

          {/* 5. Frontend Section */}
          {frontData && frontData.wireframe && (
            <Box sx={{ p: 2, bgcolor: "white", borderRadius: 1, boxShadow: 1, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>Frontend</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Wireframe</Typography>
                <img src={frontData.wireframe} alt="Wireframe" style={{ maxWidth: '100%' }} />
              </Box>
              {frontData.writer && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  작성자: {frontData.writer} | 
                  작성일: {new Date(frontData.regDate).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default Resultpage;
