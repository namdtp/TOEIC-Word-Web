import React, { useState } from "react";
import wordList from "../data/wordList";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";

const FlashCardMode = () => {
  const [index, setIndex] = useState(0);

  const getRandomIndex = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * wordList.length);
    } while (newIndex === index);
    return newIndex;
  };

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % wordList.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + wordList.length) % wordList.length);
  };

  const randomCard = () => {
    setIndex(getRandomIndex());
  };

  return (
    <Box textAlign="center">
      <Typography variant="h5" gutterBottom>
        📘 Từ vựng 📘
      </Typography>
      <Flashcard word={wordList[index]} />
      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button variant="outlined" onClick={prevCard}>⬅️ Trước</Button>
        <Button variant="outlined" onClick={nextCard}>Tiếp ➡️</Button>
        <Button variant="outlined" onClick={randomCard}>🔀 Ngẫu nhiên</Button>
      </Stack>
    </Box>
  );
};

const Flashcard = ({ word }) => {
  const [flipped, setFlipped] = useState(false);

  const toggleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 300,
        height: 180,
        mx: "auto",
        my: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: "bold",
        cursor: "pointer",
        bgcolor: flipped ? "warning.dark" : "info.dark"
      }}
      onClick={toggleFlip}
    >
      {flipped ? word.vietnamese : word.english}
    </Paper>
  );
};

export default FlashCardMode;