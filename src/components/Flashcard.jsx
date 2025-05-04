import React, { useState, useEffect } from 'react'
import '../styles/Flashcard.css'

function Flashcard({ word }) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [word])

  return (
    <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
      <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
        <div className="front">{word.english}</div>
        <div className="back">{word.vietnamese}</div>
      </div>
    </div>
  )
}

export default Flashcard