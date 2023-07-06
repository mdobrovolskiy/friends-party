import React from 'react'
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const PlayField = React.memo(
  ({
    users,
    uniqueId,
    admin,
    isGameStarted,
    entryPointScore,
    isTeamReady,
    currentTeamMove,
    timeLeft,
    isRoundStarted,
    lastWord,
    moverLimit,
    isRoundEnded,
    teamCount,
    nextMove,
    calculateCurrentMove,
    currentTeamLeader,
    roundScore,
    lightTheme,
    client,
  }) => {
    const playersWithTeam = users.filter((item) => item.team > 0)

    const [isTimerActive, setIsTimerActive] = useState(false)
    const [timer, setTimer] = useState(60)

    const [intervalId, setIntervalId] = useState(null)

    const params = useParams()

    const nextTeamMove = () => {
      if (currentTeamMove < teamCount) {
        return currentTeamMove + 1
      } else if (currentTeamMove === teamCount) {
        return 1
      }
    }
    const startCounter = () => {
      const id = setInterval(() => {
        setTimer((timer) => timer - 1)
      }, 1000)
      setIntervalId(id)
    }
    function updateUsersStatus() {
      const a = users.filter((user) => user.team === currentTeamMove)
      a.forEach(async (user) => {
        const userRef = doc(db, `usersId=${params.id}`, user.id)
        await updateDoc(userRef, {
          isReady: false,
        })
      })
    }

    async function updateCounter() {
      if (timer !== 50) {
        const userRef = doc(db, `usersId=${params.id}`, admin.id)
        await updateDoc(userRef, {
          timeLeft: timer,
        })
      } else {
        const userRef = doc(db, `usersId=${params.id}`, admin.id)
        await updateDoc(userRef, {
          timeLeft: 60,
        })
      }
    }

    async function roundEnd() {
      const userRef = doc(db, `usersId=${params.id}`, admin.id)
      await updateDoc(userRef, {
        isRoundStarted: false,
        moverLimit: 1,
        isRoundEnded: true,
      })
    }

    useEffect(() => {
      if (isRoundStarted && intervalId === null) {
        setIsTimerActive(true)
        startCounter()
        setTimer(timeLeft)
      }
    }, [isRoundStarted])
    useEffect(() => {
      if (isTimerActive) {
        updateCounter()
      }
      if (timer === 50) {
        clearInterval(intervalId)
        setTimer(60)
        setIsTimerActive(false)
        roundEnd()
      }
    }, [timer, intervalId])

    const addLastWord = async () => {
      if (lastWord) {
        const roundWordsRef = doc(db, `usersId=${params.id}`, admin.id)
        const nestedCollectionRef = collection(
          roundWordsRef,
          `roundWordsId=${uniqueId}`
        )

        await addDoc(nestedCollectionRef, {
          word: lastWord,
          score: 1,
          created: Date.now(),
        })
      }
    }
    const addUniqueId = async () => {
      const userRef = doc(db, `usersId=${params.id}`, admin.id)
      await updateDoc(userRef, {
        uniqueId: Date.now(),
      })
    }

    const handleMainButton = async () => {
      let userRef
      switch (true) {
        case isGameStarted && currentTeamMove === client.team && !isTeamReady:
          if (!client.isReady) {
            userRef = doc(db, `usersId=${params.id}`, client.id)
            await updateDoc(userRef, {
              isReady: true,
            })
          } else {
            userRef = doc(db, `usersId=${params.id}`, client.id)
            await updateDoc(userRef, {
              isReady: !client.isReady,
            })
          }
          break
        case isGameStarted &&
          currentTeamMove === client.team &&
          !isRoundStarted:
          if (client.id !== nextMove && !isRoundEnded) {
            userRef = doc(db, `usersId=${params.id}`, client.id)
            await updateDoc(userRef, {
              isReady: !client.isReady,
            })
          } else if (!isRoundEnded && !isRoundStarted) {
            startCounter()
            userRef = doc(db, `usersId=${params.id}`, admin.id)
            await updateDoc(userRef, {
              isRoundStarted: true,
              isRoundEnded: false,
              moverLimit: moverLimit + 1,
            })
            addLastWord()
            setIsTimerActive(true)
          } else if (isRoundEnded) {
            updateUsersStatus()
            userRef = doc(db, `usersId=${params.id}`, currentTeamLeader.id)
            await updateDoc(userRef, {
              nextMove: calculateCurrentMove(),
              entryPointScore: entryPointScore + roundScore,
            })
            userRef = doc(db, `usersId=${params.id}`, admin.id)
            await updateDoc(userRef, {
              currentTeamMove: nextTeamMove(),
              isRoundEnded: false,
            })
            addUniqueId()
          }
          break
        case client == admin && !isGameStarted:
          if (playersWithTeam.length > 0) {
            userRef = doc(db, `usersId=${params.id}`, client.id)
            await updateDoc(userRef, {
              isGameStarted: true,
            })
          }

          break
        case isRoundStarted:
          if (client.id === nextMove) {
            userRef = doc(db, `usersId=${params.id}`, admin.id)
            await updateDoc(userRef, {
              moverLimit: moverLimit + 1,
            })
            addLastWord()
          }
          break

        default:
      }
    }

    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60

      const formattedMinutes = String(minutes).padStart(2, '0')
      const formattedSeconds = String(remainingSeconds).padStart(2, '0')

      return `${formattedMinutes}:${formattedSeconds}`
    }
    const displayedTime = formatTime(timeLeft)
    const displayedText = () => {
      if (client) {
        switch (true) {
          case !isGameStarted:
            if (client == admin) {
              return 'Start'
            } else {
              return 'Waiting'
            }
          case client.team === currentTeamMove && !isTeamReady:
            if (client.isReady) {
              return 'Not ready'
            } else {
              return 'Ready'
            }
          case client.id === nextMove && !isRoundStarted && !isRoundEnded:
            if (isTeamReady) {
              return 'Start round'
            } else {
              return 'Waiting'
            }
          case client.id !== nextMove && client.team === currentTeamMove:
            if (isTeamReady) {
              return 'Unready'
            }
            break
          case isRoundEnded && client.team === currentTeamMove:
            return 'Confirm'
          case client.team !== currentTeamMove:
            return 'Waiting'
          case isRoundStarted:
            if (client.id === nextMove && currentTeamMove === client.team) {
              return 'Next'
            } else if (currentTeamMove === client.team) {
              return 'Answer!'
            } else {
              return 'Prepare'
            }

          default:
            return 'Spectating'
        }
      }
    }
    const displayedSubText = () => {
      if (client) {
        switch (true) {
          case !isGameStarted:
            return 'Waiting for start'

          case client.team === currentTeamMove && !isTeamReady:
            return 'Get ready'
          case isRoundEnded && client.team === currentTeamMove:
            return 'Check and confirm'
          case client.team !== currentTeamMove:
            return 'Waiting'
          case isRoundStarted:
            if (currentTeamMove === client.team) {
              return 'Time to shine'
            } else {
              return 'Opponent team is playing'
            }
          case currentTeamMove === client.team &&
            !isTeamReady &&
            client.isReady:
            return 'Waiting for teammate'
          case isTeamReady:
            return 'Waiting for leader to start'
          default:
            return 'Waiting'
        }
      }
    }

    return (
      <>
        <div className="counter">{displayedTime}</div>
        <div className={`playField ${lightTheme && 'light'}`}>
          <div className="fieldText">{displayedSubText()}</div>
          <button
            className={`${lightTheme && 'dark darkBtn'}`}
            onClick={handleMainButton}
          >
            {displayedText()}
          </button>
        </div>
      </>
    )
  }
)

export default PlayField
