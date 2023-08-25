import React from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { db } from '../firebase'
import { useParams } from 'react-router-dom'
import User from './User'
import { useEffect } from 'react'
import { useState } from 'react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const Team = React.memo(
  ({
    lightTheme,
    users,
    team,
    isGameStarted,
    nextMove,
    currentTeamMove,
    isRoundStarted,
    isRoundEnded,
    client,
  }) => {
    const { t } = useTranslation()
    const inputRef = useRef()
    const params = useParams()
    const thisTeam = users?.filter((user) => user.team == team)
    const teamScore = thisTeam[0]?.teamScore
    const clientTeam = users?.filter((user) => user.team === client?.team)
    const [scoreValue, setScoreValue] = useState(teamScore)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
      if (teamScore) {
        setScoreValue(teamScore)
      }
    }, [teamScore])
    const updateUserTeam = async () => {
      if (
        !isGameStarted &&
        (clientTeam.length !== 1 || thisTeam.length > 0 || client.team == 0)
      ) {
        if (team !== client.team) {
          const userRef = doc(db, `usersId=${params.id}`, client.id)
          await updateDoc(userRef, {
            team: team,
          })
        }
      }
    }
    useEffect(() => {
      if (users.length > 0) {
        const teamBefore = users.filter((user) => user.team == team - 1)
        if (teamBefore.length === 0 && team !== 1) {
          const moveUsersLeft = () => {
            thisTeam.forEach(async (item) => {
              const userRef = doc(db, `usersId=${params.id}`, item.id)
              await updateDoc(userRef, {
                team: team - 1,
              })
            })
          }
          moveUsersLeft()
        }
      }
    }, [users])

    const changeScore = async () => {
      if (scoreValue !== teamScore && scoreValue > -1 && scoreValue < 100) {
        const thisTeamLeader = thisTeam[0]
        const userRef = doc(db, `usersId=${params.id}`, thisTeamLeader.id)
        await updateDoc(userRef, {
          teamScore: +scoreValue,
          entryPointScore: +scoreValue,
        })
      } else {
        setScoreValue(teamScore)
      }
      setIsEditing(false)
    }
    useEffect(() => {
      if (isEditing) {
        inputRef.current.focus()
      }
    }, [isEditing])
    const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        changeScore()
      } else if (e.code === 'Escape') {
        setIsEditing(false)
        setScoreValue(teamScore)
      }
    }
    return (
      <div
        onClick={updateUserTeam}
        className={`teamWrap ${lightTheme && 'darkCard'} ${
          isGameStarted && 'noPointer'
        }`}
      >
        {isGameStarted && (
          <div className="score">
            {t('main.score')}:{' '}
            {isEditing ? (
              <input
                onKeyDown={handleKeyPress}
                onChange={(e) => setScoreValue(e.target.value)}
                ref={inputRef}
                className="editScore"
                type="number"
                value={scoreValue}
              />
            ) : (
              teamScore
            )}
            {isEditing ? (
              <img
                onClick={changeScore}
                src="https://cdn-icons-png.flaticon.com/128/845/845646.png"
                alt="confirm Edit"
              />
            ) : (
              !isRoundEnded &&
              client?.isAdmin && (
                <img
                  onClick={() => setIsEditing(true)}
                  src="https://cdn-icons-png.flaticon.com/128/1828/1828270.png"
                  alt=""
                />
              )
            )}
          </div>
        )}
        {thisTeam.map((user) => (
          <User
            clientId={client}
            isRoundEnded={isRoundEnded}
            isRoundStarted={isRoundStarted}
            currentTeamMove={currentTeamMove}
            nextMove={nextMove}
            isGameStarted={isGameStarted}
            key={user.id}
            user={user}
          />
        ))}
      </div>
    )
  }
)

export default Team
