// App.jsx

import React, { useState, useEffect } from 'react';
import IntroPage from './IntroPage';
import QuizPage from './QuizPage';
import './App.css';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);

  const startQuiz = (value) => {
    setQuizStarted(value);
  };


  console.log('rerendering');

  return (
    <>
      {quizStarted ? (
        <QuizPage quizStarted={quizStarted} startQuiz={startQuiz} />
      ) : (
        <IntroPage startQuiz={startQuiz} />
      )}
    </>
  );
}

export default App;
