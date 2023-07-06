import React from 'react'
import { useNavigate } from 'react-router-dom'

const CardGame = ({ img, title, description, createUser }) => {
  return (
    <div className="card">
      <div className="topImage">
        <img src={img} alt="" />
      </div>
      <div className="bottomCard">
        <div className="cardDescr">
          <div className="cardTitle">
            <h1>{title}</h1>
          </div>
          <div className="cardParagraph">
            <p>{description}</p>
          </div>
        </div>
        <div className="createBtn">
          <button onClick={createUser}>Create {title} lobby</button>
        </div>
      </div>
    </div>
  )
}

export default CardGame
