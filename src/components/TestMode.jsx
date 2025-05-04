// TestMode.jsx
import React, { useState, useEffect } from "react";
import wordList from "../data/wordList";
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const getRandomIndexOrder = (length) => {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const TestMode = () => {
  const [order, setOrder] = useState(getRandomIndexOrder(wordList.length));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(Array(wordList.length).fill(null));
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("quiz_history");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("quiz_history", JSON.stringify(history));
  }, [history]);

  const currentWord = wordList[order[currentIndex]];
  const choices = shuffle([
    currentWord.vietnamese,
    ...shuffle(wordList)
      .filter((w) => w.vietnamese !== currentWord.vietnamese)
      .slice(0, 3)
      .map((w) => w.vietnamese),
  ]);

  const handleSelect = (choice) => {
    setSelected(choice);
    setShowAnswer(true);
    const correct = choice === currentWord.vietnamese;
    if (correct) setScore(score + 1);
    const updated = [...answered];
    updated[currentIndex] = correct ? "correct" : "wrong";
    setAnswered(updated);
    setHistory((prev) => [
      ...prev,
      {
        word: currentWord.english,
        selected: choice,
        correctAnswer: currentWord.vietnamese,
        isCorrect: correct,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const nextQuestion = () => {
    setSelected(null);
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % order.length);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) setFilter(newFilter);
  };

  const handleRetryWrong = () => {
    const wrongIndexes = order.filter((_, i) => answered[i] === "wrong");
    if (wrongIndexes.length > 0) {
      setOrder(shuffle(wrongIndexes));
      setAnswered(Array(wordList.length).fill(null));
      setCurrentIndex(0);
      setScore(0);
      setSelected(null);
      setShowAnswer(false);
      setFilter("all");
      setHistory([]);
    }
  };

  const filteredOrder = order.filter((_, i) => {
    if (filter === "all") return true;
    return answered[i] === filter;
  });

  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={6}>
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            {currentIndex + 1}. {currentWord.english}
          </Typography>
          <Stack spacing={1}>
            {choices.map((choice) => (
              <Button
                key={choice}
                variant="outlined"
                color={
                  showAnswer
                    ? choice === currentWord.vietnamese
                      ? "success"
                      : choice === selected
                      ? "error"
                      : "primary"
                    : "primary"
                }
                onClick={() => handleSelect(choice)}
                disabled={showAnswer}
              >
                {choice}
              </Button>
            ))}
          </Stack>
          {showAnswer && (
            <Box mt={2}>
              <Typography>
                Đáp án đúng: <strong>{currentWord.vietnamese}</strong>
              </Typography>
              <Button variant="contained" sx={{ mt: 1 }} onClick={nextQuestion}>
                Tiếp theo
              </Button>
            </Box>
          )}
          <Typography mt={3}>Điểm: {score}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Trạng thái câu hỏi
          </Typography>
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            fullWidth
            sx={{ mb: 2 }}
          >
            <ToggleButton value="all">Tất cả</ToggleButton>
            <ToggleButton value="correct">Đúng</ToggleButton>
            <ToggleButton value="wrong">Sai</ToggleButton>
          </ToggleButtonGroup>
          <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>
            {filteredOrder.map((idx, i) => {
              const actualIndex = order.indexOf(idx);
              return (
                <Button
                  key={actualIndex}
                  size="small"
                  variant={actualIndex === currentIndex ? "contained" : "outlined"}
                  color={
                    answered[actualIndex] === "correct"
                      ? "success"
                      : answered[actualIndex] === "wrong"
                      ? "error"
                      : "inherit"
                  }
                  onClick={() => setCurrentIndex(actualIndex)}
                >
                  {actualIndex + 1}
                </Button>
              );
            })}
          </Stack>
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            onClick={handleRetryWrong}
            disabled={!answered.includes("wrong")}
          >
            🔁 Làm lại các câu sai
          </Button>
        </Paper>
        {history.length > 0 && (
          <Paper elevation={1} sx={{ mt: 3, p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Lịch sử làm bài</Typography>
<Stack spacing={1}>
  {history.map((entry, i) => (
    <Box key={i}>
      <Typography>
        {i + 1}. <strong>{entry.word}</strong>: bạn chọn "{entry.selected}" – {entry.isCorrect ? "✅ Đúng" : `❌ Sai, đúng là "${entry.correctAnswer}"`}
      </Typography>
    </Box>
  ))}
</Stack>
<Button
  fullWidth
  variant="outlined"
  color="error"
  sx={{ mt: 2 }}
  onClick={() => {
    localStorage.removeItem("quiz_history");
    setHistory([]);
  }}
>
  🗑️ Xóa lịch sử làm bài
</Button>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};

export default TestMode;
