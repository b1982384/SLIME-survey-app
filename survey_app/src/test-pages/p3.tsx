import React from 'react'
import { useNavigate } from 'react-router-dom'

const P3: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>RESULTS PAGE</h1>
      <button onClick={() => navigate('/')}>Go to Welcome Page</button>
    </div>
  )
}

export default P3

