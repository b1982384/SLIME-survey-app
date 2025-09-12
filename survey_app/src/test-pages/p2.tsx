import React from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  "I think that artists make better music when they aren’t really popular",
  "I don't like the music my friends listen to",
  "I worry that my music platform recommends music for its own interests not mine",
  "I will listen to music via... - Full albums",
  "When I hear a new song from a playlist, autoplay, or other passive source, I look up the artist or track to learn more.",
  "I choose music without considering how I'm feeling (negatively weighted)",
  "When I hear a new song from a playlist, autoplay, or other passive source, I save or like it to return to later.",
  "I keep up with popular/trending songs",
  "I prefer to find my own music and tend not to listen to what others think (negatively weighted)"
]

const likertLabels = [
  "Strongly Disagree",
  "Disagree",
  "Somewhat Disagree",
  "Neutral",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree"
]

const P2: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate('/p3')}>Go to page 3</button>
      <h1>Survey Page 2</h1>
      {questions.map((q, idx) => (
        <div key={idx} style={{ marginBottom: "2em" }}>
          <div>{q}</div>
          <div>
            {likertLabels.map((label, i) => (
              <label key={i} style={{ marginRight: "1em" }}>
                <input type="radio" name={`p2q${idx}`} value={i + 1} />
                {label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default P2