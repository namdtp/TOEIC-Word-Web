// App.jsx
import React from "react";
import TestMode from "./components/TestMode";
import {
  Container,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const customPalette = {
  mode: "light",
  primary: { main: "#10a37f" },
  secondary: { main: "#0077cc" },
  background: {
    default: "#f7f7f8",
    paper: "#ffffff",
  },
  text: {
    primary: "#1e1e1e" },
};

const lightTheme = createTheme({ palette: customPalette });

const App = () => {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
           Học từ vựng - Kiểm tra 
        </Typography>
        <TestMode />
      </Container>
    </ThemeProvider>
  );
};

export default App;
