import React from "react";
import Confetti  from "react-confetti";
import './ConfettiRender.css'

function ConfettiRender () {
  return (
    <div className="confetti-div">
      <Confetti />
    </div>
  )
}

export default ConfettiRender