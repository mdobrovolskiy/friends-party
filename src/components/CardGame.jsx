import React from 'react'
import { useTranslation } from 'react-i18next'

const CardGame = ({ img, title, description, createUser }) => {
  const { t } = useTranslation()
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
          <button onClick={createUser}>
            {t('landing.create')} {title} {t('landing.lobby')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardGame
