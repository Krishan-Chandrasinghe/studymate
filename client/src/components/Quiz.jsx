import { useMemo, useState } from 'react'

function Quiz({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(
    () => quiz.filter((q, i) => answers[i] === q.correctIndex).length,
    [quiz, answers],
  )

  const selectOption = (questionIndex, optionIndex) => {
    if (submitted) return
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleCheckAnswers = () => setSubmitted(true)

  const handleRetry = () => {
    setAnswers({})
    setSubmitted(false)
  }

  const allAnswered = quiz.every((_, i) => answers[i] !== undefined)

  return (
    <div className="quiz">
      <h4 className="quiz-title">Quiz Mode</h4>

      {quiz.map((question, qIndex) => (
        <fieldset className="quiz-question" key={qIndex}>
          <legend>{question.question}</legend>
          <div className="quiz-options">
            {question.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex
              const isCorrectOption = oIndex === question.correctIndex

              let optionClass = 'quiz-option'
              if (isSelected) optionClass += ' selected'
              if (submitted && isCorrectOption) optionClass += ' correct'
              if (submitted && isSelected && !isCorrectOption) optionClass += ' incorrect'

              return (
                <button
                  key={oIndex}
                  type="button"
                  className={optionClass}
                  onClick={() => selectOption(qIndex, oIndex)}
                  disabled={submitted}
                >
                  {option}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}

      <div className="quiz-actions">
        {submitted ? (
          <>
            <span className="quiz-score">
              Score: {score} / {quiz.length}
            </span>
            <button type="button" className="btn btn-ghost-quiz" onClick={handleRetry}>
              Try Again
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCheckAnswers}
            disabled={!allAnswered}
          >
            Check Answers
          </button>
        )}
      </div>
    </div>
  )
}

export default Quiz
