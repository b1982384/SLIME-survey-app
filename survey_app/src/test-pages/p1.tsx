import React from 'react'
import { useNavigate } from 'react-router-dom'

const questions = [
  "I feel like I play a strong role in how things are recommended to me",
  "I enjoy the music my music platform plays when it takes over (e.g. autoplay, radio, mixes)",
  "I can rely on my music platform's recommendations when I want to hear something new",
  "I prefer to skip songs the platform adds or suggests automatically",
  "I feel uneasy letting the platform decide what to play next",
  "I avoid app-curated playlists and mixes – I prefer my own",
  "I add or edit my existing playlists",
  "I make playlists for myself",
  "I make and create playlists on my music platform"
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


// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// const P3: React.FC = () => {
//   const navigate = useNavigate()
//   return (
//     <div>
//       <h1>This is Page 3 - mixed</h1>
//       <button onClick={() => navigate('/')}>Go to Page 1</button>
//     </div>
//   )
// }

// export default P3

const P1: React.FC = () => {
const navigate = useNavigate()
  return (
    <div>
      <button onClick={() => navigate('/p2')}> Go to Page 2</button>
      <h1>Survey Page 1 - one block</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Question</th>
            {likertLabels.map((label, i) => (
              <th key={i}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={idx}>
              <td>{q}</td>
              {likertLabels.map((_, i) => (
                <td key={i}>
                  <input type="radio" name={`q${idx}`} value={i + 1} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default P1