import React from 'react'
import '../App.css'

import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/Slices/userSlice'
import CardGame from '../components/CardGame'
import { setTheme } from '../redux/Slices/themeSlice'
import { useTranslation } from 'react-i18next'

const CreateGame = () => {
  const { t } = useTranslation()
  const lightTheme = useSelector((state) => state.themeSlice.lightTheme)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.currentUserSlice.userName)

  let a = Math.floor(Date.now() + Math.floor(Math.random() * 20000))
  const localId = Math.round(Date.now() + Math.random() * 10000)
  console.log(process.env)

  const createUser = async () => {
    await addDoc(collection(db, `usersId=${a}`), {
      userName: currentUser || 'admin',
      isAdmin: true,
      team: 0,
      isReady: false,
      currentTeamMove: 1,
      isGameStarted: false,
      isRoundEnded: false,
      isRoundStarted: false,
      moverLimit: 1,
      nextMove: 0,
      teamScore: 0,
      timeLeft: 60,
      uniqueId: Date.now(),
      isGameEnded: false,
      localId: localId,
      entryPointScore: 0,
      winPoints: 20,
      avatar: 'https://i.ibb.co/gwHzVsd/goatverse-4x.webp',
      isOnline: true,
    })
    navigate(`/${a}`)
    dispatch(
      setCurrentUser([
        currentUser || 'admin',
        localId,
        'https://i.ibb.co/gwHzVsd/goatverse-4x.webp',
      ])
    )
  }
  return (
    <div
      className="createGame"
      style={{
        background: lightTheme
          ? 'linear-gradient(0deg, rgba(27,33,92,1) 0%, rgba(0,0,0,1) 100%)'
          : 'linear-gradient(0deg, rgba(246,245,208,1) 0%, rgba(133,243,246,1) 100%)',
        color: lightTheme ? '#fff' : '#000',
      }}
    >
      <div className="toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={lightTheme}
            onChange={(e) => dispatch(setTheme(e.target.checked))}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className="wrapperAction">
        <CardGame
          createUser={createUser}
          title={t('landing.alias')}
          description={t('landing.subText')}
          img={'https://i.ibb.co/WsX0C9Y/256x256bb.webp'}
        />
        <CardGame
          title={t('landing.memes')}
          description={t('landing.dev')}
          img={'https://i.ibb.co/FqHQbrN/unnamed-1.webp'}
        />
      </div>
    </div>
  )
}

export default CreateGame
