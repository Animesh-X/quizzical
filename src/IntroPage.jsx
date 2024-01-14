import React from 'react'
import './IntroPage.css'

function IntroPage(props) {
    const handleClick = () => {
        props.startQuiz(true);
    }
    return (
        <div className="intro-container">
            <h2 className="header-nav" >Quizzical</h2>
            <h3 className="intro-caption">A little trivia never hurt nobody</h3>
            <button onClick={handleClick}  className="intro-btn" >Start Quiz</button>
        </div>
    )
}

export default IntroPage;