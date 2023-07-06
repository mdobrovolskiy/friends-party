import React, { useRef } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentUser } from '../redux/Slices/userSlice'
import { avatars } from '../avatars'
import Avatar from './Avatar'
const Settings = ({
  users,
  client,
  isGameStarted,
  settingsOpened,
  setSettingsOpened,
  settingsRef,
  winPoints,
  admin,
  teamCount,
  avatarIndex,
  setAvatarIndex,
  clientLocalId,
  clientAvatar,
}) => {
  const userNameInputRef = useRef()
  const dispatch = useDispatch()
  const params = useParams()
  const modalRef = useRef()
  const [inputValue, setInputValue] = useState(client?.userName)
  const [inputOpen, setInputOpen] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (settingsOpened) {
      function handler(e) {
        if (
          !modalRef.current.contains(e.target) &&
          !settingsRef.current.contains(e.target)
        ) {
          setSettingsOpened(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => {
        document.removeEventListener('mousedown', handler)
      }
    }
  }, [settingsOpened])
  const [score, setScore] = useState(20)
  const [isEditing, setIsEditing] = useState(false)
  const shufflePlayers = () => {
    if (!isGameStarted && client == admin && teamCount > 2) {
      const randomIndexes = users
        .map((item) => item.team)
        .sort(() => Math.random() - 0.5)
      randomIndexes.forEach((team, i) => {
        const updateUserTeam = async () => {
          const userRef = doc(db, `usersId=${params.id}`, users[i].id)
          await updateDoc(userRef, {
            team: team,
            nextMove: users[i].id,
          })
        }
        updateUserTeam()
      })
    }
  }

  const handleScore = (e) => {
    if (client == admin) {
      setScore(e.target.value)
    }
  }
  const confirmScore = () => {
    if (client == admin) {
      if (score > 99) {
        setScore(99)
      } else if (score < 10) {
        setScore(10)
      }
      setIsEditing(false)
      inputRef.current.blur()
    }
  }
  const handlePlusMinus = (operation) => {
    if (client == admin) {
      if (operation == 'plus' && score < 99) {
        setScore((state) => state + 1)
      } else if (operation == 'minus' && score > 10) {
        setScore((state) => state - 1)
      }
    }
  }
  const inputRef = useRef()
  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus()
    }
  }, [isEditing])
  const handleKeyPress = (e) => {
    if (client == admin) {
      if (e.keyCode === 13) {
        e.preventDefault()
        confirmScore()
      } else if (e.code === 'Escape') {
        confirmScore()
      }
    }
  }

  const changeUserName = async () => {
    if (
      inputValue.trim() !== '' &&
      inputValue.length < 16 &&
      client.userName !== inputValue
    ) {
      dispatch(setCurrentUser([inputValue, clientLocalId, clientAvatar]))
      const userRef = doc(db, `usersId=${params.id}`, client.id)
      await updateDoc(userRef, {
        userName: inputValue,
      })
      setInputOpen(false)
      setError(false)
    } else if (inputValue.trim() === '' || inputValue.length > 16) {
      setError(true)
    } else {
      setInputOpen(false)
      setError(false)
    }
  }

  const handleKeyPressUserName = (e) => {
    if (inputValue.trim() !== '') {
      if (e.keyCode === 13) {
        e.preventDefault()
        changeUserName()
      } else if (e.code === 'Escape') {
        setInputValue('')
        setInputOpen(false)
      }
    }
  }
  useEffect(() => {
    if (inputOpen) {
      userNameInputRef.current.focus()
    }
  }, [inputOpen])
  const restartGame = async () => {
    users.forEach(async (user) => {
      if (user.isAdmin) {
        const userRef = doc(db, `usersId=${params.id}`, user.id)
        await updateDoc(userRef, {
          userName: user.userName,
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
          winPoints: 20,
          isGameEnded: false,
          entryPointScore: 0,
        })
      } else {
        const userRef = doc(db, `usersId=${params.id}`, user.id)
        await updateDoc(userRef, {
          userName: user.userName,
          isAdmin: false,
          team: 0,
          isReady: false,
          teamScore: 0,
          entryPointScore: 0,
          nextMove: 0,
        })
      }
    })
  }
  return (
    <div className="settingsWrap">
      <div ref={modalRef} className="settingsMain">
        <div className="settingsItem">
          Score to win:{' '}
          <input
            onClick={() => setIsEditing(true)}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            type="number"
            max={99}
            min={10}
            value={score}
            onChange={handleScore}
          />
          <div className="plus">
            <img
              onClick={() => handlePlusMinus('minus')}
              src="https://cdn-icons-png.flaticon.com/128/2377/2377836.png"
              alt=""
            />
            <img
              onClick={() => handlePlusMinus('plus')}
              src="https://cdn-icons-png.flaticon.com/128/4604/4604818.png"
              alt=""
            />
          </div>
          {isEditing ? (
            <img
              onClick={confirmScore}
              src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
              alt=""
            />
          ) : (
            <img
              onClick={() => setIsEditing(!isEditing)}
              src="https://cdn-icons-png.flaticon.com/128/760/760775.png"
              alt=""
            />
          )}
        </div>
        <div className="settingsItem">
          Shuffle players{' '}
          <img
            onClick={shufflePlayers}
            src="https://cdn-icons-png.flaticon.com/128/10152/10152527.png"
            alt=""
          />
        </div>
        <div className="settingsItem">
          Restart game{' '}
          <img
            onClick={restartGame}
            src="https://cdn-icons-png.flaticon.com/128/560/560512.png"
            alt=""
          />
        </div>
        <div className="settingsItem">
          {inputOpen ? (
            <input
              ref={userNameInputRef}
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              onKeyDown={handleKeyPressUserName}
              className="changeIGN"
              type="text"
              placeholder="Change username"
            />
          ) : (
            <span> Change username </span>
          )}
          {inputOpen ? (
            <>
              {inputValue.length > 16 ? (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/1828/1828665.png"
                  alt=""
                />
              ) : (
                <img
                  onClick={changeUserName}
                  src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                  alt=""
                />
              )}
            </>
          ) : (
            <img
              onClick={() => setInputOpen(true)}
              src="https://cdn-icons-png.flaticon.com/128/760/760775.png"
              alt=""
            />
          )}
        </div>
        <div className="modalAvatarContainer">
          {avatars.map((image, i) => (
            <Avatar
              key={image}
              params={params}
              client={client}
              img={image}
              i={i}
              avatarIndex={avatarIndex}
              setAvatarIndex={setAvatarIndex}
            />
          ))}
        </div>
        {error && (
          <div className="error">
            Error, username should be less than 17 symbols
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
