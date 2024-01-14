import React, { useEffect, useState } from 'react';
import { Button, Loader, Placeholder } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './QuizPage.css';
import ConfettiRender from './ConfettiRender';

function QuizPage(props) {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const [quizData, setQuizData] = useState([]);
  const [selectedValues, setSelectedValues] = useState(Array(10).fill({ value: '', count: 0 }));
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctAnswerCount, setCorrectAnswerCount] = useState(0);
  let randomNumber = 0;

  useEffect(() => {
    console.log('ran');
    if (isStarted && props.quizStarted) {
      fetch(`https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.results);
          if (data.response_code === 0) {
            setQuizData(data.results);
          }
        })
        .catch((error) => console.error("Error fetching quiz data:", error));
    }
  }, [isStarted]);

  const startQuiz = (event) => {
    event.preventDefault();
    console.log(selectedCategory);
    console.log(selectedDifficulty);
    setIsStarted(true);
  }

  const handleClick = (event, index) => {
    event.preventDefault();
    const newValue = event.target.value;
    setSelectedValues((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index] = {
        ...updatedValues[index],
        count: updatedValues[index].count + 1
      };
      if (updatedValues[index].count % 2 !== 0) {
        updatedValues[index].value = newValue;
      }
      return updatedValues;
    });
    event.currentTarget.classList.toggle('option-selected');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const resultContainer = document.querySelector('.quiz-set');

    quizData.forEach((question, index) => {
      const selectedValue = selectedValues[index].value;
      console.log(selectedValue);
      if(!selectedValue) {
        return;
      }
      const correctAnswer = question.correct_answer;
      const options = [...question.incorrect_answers, correctAnswer];

      const selectedOptionElement = resultContainer.querySelector(`.quiz-container:nth-child(${index + 1}) .quiz-single-option[value="${selectedValue}"]`);

      if (selectedValue === correctAnswer) {
        selectedOptionElement.classList.add('correct-answer');
        setCorrectAnswerCount((prevCount) => prevCount + 1);
      } else {
        selectedOptionElement.classList.add('wrong-answer');
        const correctOptionElement = resultContainer.querySelector(`.quiz-container:nth-child(${index + 1}) .quiz-single-option[value="${correctAnswer}"]`);
        correctOptionElement.classList.add('correct-answer');
      }
    });
    setIsCompleted(true);
  };

  const swapElements = (array, index1, index2) => {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  };

  const renderingData = quizData.map((question, index) => {
    const options = [...question.incorrect_answers];
    options.push(question.correct_answer);
    randomNumber = randomNumber % (options.length + 1);
    swapElements(options, randomNumber, 3);
    randomNumber += 2;

    return (
      <div className='quiz-container' key={index}>
        <label className='quiz-question'>
          {question.question}
          <div className="quiz-options">
            {options.map((option, i) => (
              <input
                key={i}
                type="button"
                className='quiz-single-option'
                onClick={(e) => handleClick(e, index)}
                value={option}
              />
            ))}
          </div>
        </label>
        <hr className='line-break' />
      </div>
    );
  });

  const handlePlayAgain = () => {
    props.startQuiz(false);
  };

  return (
    <div className="quiz-page-container">
      {isCompleted && <ConfettiRender />}
      { isStarted ? (
        quizData.length > 0 ? (
          <div className='quiz-set' >
            <form onSubmit={handleSubmit} >
              {renderingData}
              <div className='submit-container'>
                <input
                  type="submit"
                  className={`submit-btn ${isCompleted ? 'hide' : ''}`}
                  value='Check Answer'
                />
                <div className={`submitted ${isCompleted ? '' : 'hide'}`} >
                  <p className='score-para' >You have scored {correctAnswerCount}/10 correct answer</p>
                  <button onClick={handlePlayAgain} className='play-again-btn' >Play again</button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <Placeholder.Paragraph rows={25} />
            <Loader size="lg" center content="Wait a minute" vertical />
          </div>
        )
      ) : (
        <div className='quiz-select-option' >
          <form onSubmit={startQuiz} className="selection-form" >
            <label className="selection-label" >
              Select Category
              <select className='selection-select' onChange={(e) => setSelectedCategory(Number(e.target.value))} value={selectedCategory}>
                <option value="9">General Knowledge</option>
                <option value="21">Sports</option>
                <option value="22">Geography</option>
                <option value="23">History</option>
                <option value="24">Politics</option>
                <option value="25">Art</option>
                <option value="20">Mythology</option>
              </select>
            </label>
            <label className="selection-label" >
              Select Difficulty
              <select className='selection-select' onChange={(e) => setSelectedDifficulty(e.target.value)} value={selectedDifficulty} >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>
            <input className='selection-submit' type="submit" value="Let's Go"/>
          </form>
        </div>
      )}
    </div>
  );
}

export default QuizPage;