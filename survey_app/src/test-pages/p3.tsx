import React from 'react'
import { useNavigate } from 'react-router-dom'

const P3: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h1>This is Page 3 - mixed</h1>
      <button onClick={() => navigate('/')}>Go to Page 1</button>
    </div>
  )
}

export default P3

