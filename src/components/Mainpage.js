import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import React from 'react';

export const Mainpage = () => {
  return (
    <Box
      sx={{
        bgcolor: 'white',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Container maxWidth='lg' sx={{ height: '1024px', position: 'relative' }}>
        <Typography
          variant='h1'
          align='center'
          sx={{
            position: 'absolute',
            top: '370px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '300px',
            fontFamily: "'Inter', Helvetica",
            fontWeight: 'bold',
            color: 'text.primary',
            fontSize: '40px',
          }}
        >
          GIRAAAAAAAAAAAAAA버그많네요
          <br />
          ...
          <br />
          쉬운 웹 프로젝트 <br />
          문서관리 시스템
        </Typography>
      </Container>
    </Box>
  );
};

export default Mainpage;
