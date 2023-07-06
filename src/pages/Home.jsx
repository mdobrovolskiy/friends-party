import '../App.css'
import Team from '../components/Team'
import PlayField from '../components/PlayField'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Modal from '../components/Modal'
import { words } from '../data'
import { useParams } from 'react-router-dom'
import { addDoc } from 'firebase/firestore'
import WinModal from '../components/WinModal'
import CopyLink from '../components/CopyLink'

import { setCurrentUser } from '../redux/Slices/userSlice'

import {
  query,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from 'firebase/firestore'
import { db } from '../firebase'

import Word from '../components/Word'
import Settings from '../components/Settings'
import { useRef } from 'react'
import { setTheme } from '../redux/Slices/themeSlice'
import User from '../components/User'
import { setSessionWords } from '../redux/Slices/wordsSlice'

function Home() {
  const params = useParams()
  const dispatch = useDispatch()
  const sessionWords = useSelector((state) => state.wordsSlice.words)
  const lightTheme = useSelector((state) => state.themeSlice.lightTheme)

  const [settingsOpened, setSettingsOpened] = useState(false)

  let randomWordIndex = Math.floor(Math.random() * sessionWords.length)
  const [teamCount, setTeamCount] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])

  const [roundWords, setRoundWords] = useState([])
  const [lastWord, setLastWord] = useState('')
  const [avatarIndex, setAvatarIndex] = useState(3)
  const roundScore = roundWords
    ?.map((item) => item.score)
    ?.reduce((acc, item) => acc + item, 0)
  console.log(words)
  const currentUser = useSelector((state) => state.currentUserSlice.userName)

  const admin = users.find((user) => user.isAdmin === true)

  const currentTeamMove = admin?.currentTeamMove

  const isGameStarted = admin?.isGameStarted
  const isRoundStarted = admin?.isRoundStarted
  const isRoundEnded = admin?.isRoundEnded
  const winPoints = admin?.winPoints

  const moverLimit = admin?.moverLimit
  const currentTeam = users?.filter((user) => user.team === currentTeamMove)
  const currentTeamLeader = users?.filter(
    (user) => user.team === currentTeamMove
  )[0]
  const nextMove = currentTeam[currentTeamLeader?.nextMove]?.id

  const uniqueId = admin?.uniqueId
  const isGameEnded = admin?.isGameEnded

  const calculateCurrentMove = () => {
    if (
      currentTeam.findIndex((item) => item.id === nextMove) + 1 <
      currentTeam.length
    ) {
      return currentTeam.findIndex((item) => item.id === nextMove) + 1
    } else {
      return 0
    }
  }

  const entryPointScore = currentTeamLeader?.entryPointScore
  const timeLeft = admin?.timeLeft
  const teamReady = users?.filter(
    (user) => user.team === currentTeamMove && user.isReady === false
  )
  const isTeamReady = teamReady.length === 0 ? true : false
  const clientLocalId = useSelector((state) => state.currentUserSlice.id)

  const client = users?.find((user) => user.localId === clientLocalId)
  const clientAvatar = useSelector((state) => state.currentUserSlice.avatar)

  const filtered = users?.filter((user) => user.team > 0)

  const maxTeamScore = Math.max(...users?.map((user) => user.teamScore))
  const maxPointer = users?.find((user) => user.teamScore === maxTeamScore)

  useEffect(() => {
    if (sessionWords.length < 50) {
      dispatch(setSessionWords(words))
    }
  }, [])

  useEffect(() => {
    if (
      users.length > 0 &&
      currentTeamMove === 1 &&
      isGameStarted &&
      !isRoundEnded &&
      !isRoundStarted
    ) {
      if (maxPointer.teamScore >= winPoints) {
        const gameFinished = async () => {
          const userRef = doc(db, `usersId=${params.id}`, admin.id)
          await updateDoc(userRef, {
            isGameEnded: true,
          })
        }
        gameFinished()
      }
    }
  }, [currentTeamMove, isRoundEnded])
  useEffect(() => {
    if (isRoundEnded && currentTeamLeader) {
      const updateTeamScore = async () => {
        const userRef = doc(db, `usersId=${params.id}`, currentTeamLeader.id)
        await updateDoc(userRef, {
          teamScore: entryPointScore + roundScore,
        })
      }
      updateTeamScore()
    }
  }, [isRoundEnded, roundScore])

  function findMaxTeamValue() {
    let maxTeam = 0

    for (const obj of filtered) {
      if (obj.team > maxTeam) {
        maxTeam = obj.team
      }
    }

    return maxTeam
  }

  useEffect(() => {
    setLastWord(sessionWords[randomWordIndex])
  }, [moverLimit])

  useEffect(() => {
    if (isGameStarted) {
      const getRoundWords = async () => {
        const roundWordsRef = doc(db, `usersId=${params.id}`, admin.id)
        const nestedCollectionRef = collection(
          roundWordsRef,
          `roundWordsId=${uniqueId}`
        )
        const q = query(nestedCollectionRef, orderBy('created'))

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const wordsCurr = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))

          setRoundWords(wordsCurr)
        })

        return () => {
          unsubscribe()
        }
      }

      getRoundWords()
    }
  }, [currentTeamMove, uniqueId, moverLimit])

  useEffect(() => {
    const q = query(collection(db, `usersId=${params.id}`))
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = []
      QuerySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id })
      })

      setUsers(users)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (users.length > 0 && typeof client === 'undefined') {
      if (
        typeof clientLocalId === 'undefined' ||
        typeof currentUser === 'undefined' ||
        typeof clientAvatar === 'undefined' ||
        clientLocalId === 0 ||
        currentUser === '' ||
        clientAvatar === ''
      ) {
        setShowModal(true)
      } else {
        const createUser = async () => {
          await addDoc(collection(db, `usersId=${params.id}`), {
            userName: currentUser,
            isAdmin: false,
            team: 0,
            isReady: false,
            teamScore: 0,
            entryPointScore: 0,
            nextMove: 0,
            localId: clientLocalId,
            avatar: clientAvatar,
          })
        }
        createUser()
      }
    }
  }, [users, client])

  useEffect(() => {
    setTeamCount(findMaxTeamValue() + 1)
  }, [filtered])

  const mockArray = Array.from(
    { length: teamCount },
    (_, index) => `Element ${index + 1}`
  )

  const spectators = users.filter((user) => user.team < 1)
  const updateUserTeam = async () => {
    if (!isGameStarted) {
      if (client.team !== 0) {
        const washingtonRef = doc(db, `usersId=${params.id}`, client.id)
        await updateDoc(washingtonRef, {
          team: 0,
        })
      }
    }
  }
  const settingsRef = useRef()
  const wordsRef = useRef()
  useEffect(() => {
    if (users.length > 0 && isGameStarted) {
      wordsRef.current.scrollTop = wordsRef.current.scrollHeight
    }
  }, [roundWords])

  return (
    <div
      style={{
        background: lightTheme
          ? 'linear-gradient(0deg, rgba(27,33,92,1) 0%, rgba(0,0,0,1) 100%)'
          : 'linear-gradient(0deg, rgba(246,245,208,1) 0%, rgba(133,243,246,1) 100%)',
        color: lightTheme ? '#fff' : '#000',
      }}
      className="App"
    >
      <div
        ref={settingsRef}
        className="settings"
        onClick={() => setSettingsOpened(!settingsOpened)}
      >
        <button>
          <img
            src="https://cdn-icons-png.flaticon.com/128/8608/8608824.png"
            alt=""
          />
        </button>
      </div>
      <CopyLink />
      {settingsOpened && (
        <Settings
          clientAvatar={clientAvatar}
          clientLocalId={clientLocalId}
          avatarIndex={avatarIndex}
          setAvatarIndex={setAvatarIndex}
          teamCount={teamCount}
          admin={admin}
          client={client}
          winPoints={winPoints}
          settingsRef={settingsRef}
          users={users}
          isGameStarted={isGameStarted}
          settingsOpened={settingsOpened}
          setSettingsOpened={setSettingsOpened}
        />
      )}
      {isGameEnded && (
        <WinModal
          maxPointer={maxPointer}
          currentTeamLeader={currentTeamLeader}
          users={users}
        />
      )}
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

      <div className="teams">Teams:</div>
      <div className="teamContainer">
        {!isGameStarted &&
          mockArray.map((item, i) => (
            <Team
              client={client}
              lightTheme={lightTheme}
              isRoundEnded={isRoundEnded}
              isRoundStarted={isRoundStarted}
              currentTeamMove={currentTeamMove}
              nextMove={nextMove}
              isGameStarted={isGameStarted}
              key={i}
              users={users}
              team={i + 1}
            />
          ))}
        {isGameStarted &&
          mockArray
            .slice(0, mockArray.length - 1)
            .map((item, i) => (
              <Team
                client={client}
                lightTheme={lightTheme}
                isRoundEnded={isRoundEnded}
                isRoundStarted={isRoundStarted}
                currentTeamMove={currentTeamMove}
                nextMove={nextMove}
                isGameStarted={isGameStarted}
                key={i}
                users={users}
                team={i + 1}
              />
            ))}
      </div>
      {showModal && (
        <Modal
          client={client}
          users={users}
          setShowModal={setShowModal}
          avatarIndex={avatarIndex}
          setAvatarIndex={setAvatarIndex}
        />
      )}
      <div className="spectWrap">
        {!isGameStarted && (
          <button className="spectators" onClick={updateUserTeam}>
            <img
              src="https://cdn-icons-png.flaticon.com/128/4955/4955419.png"
              alt=""
            />
          </button>
        )}
        {!isGameStarted && (
          <div className="loggedUsers">
            {spectators.map((user) => (
              <div className="loggedContainer">
                <User clientId={client} user={user} key={user.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {!isGameStarted && <div className="fill"></div>}
      {isGameStarted && (
        <div className="wordsContainer">
          <div className="words" ref={wordsRef}>
            <div class="fix"></div>
            {isRoundStarted &&
              (client?.id === nextMove
                ? roundWords.map((item, i) => (
                    <Word
                      roundWords={roundWords}
                      admin={admin}
                      uniqueId={uniqueId}
                      currentTeamMove={currentTeamMove}
                      users={users}
                      roundScore={roundScore}
                      key={item.id}
                      word={item.word}
                      score={item.score}
                      id={item.id}
                      i={i}
                    />
                  ))
                : roundWords
                    .slice(0, roundWords.length - 1)
                    .map((item) => (
                      <Word
                        admin={admin}
                        uniqueId={uniqueId}
                        currentTeamMove={currentTeamMove}
                        users={users}
                        roundScore={roundScore}
                        key={item.id}
                        word={item.word}
                        score={item.score}
                        id={item.id}
                      />
                    )))}
            {isRoundEnded &&
              roundWords.map((item) => (
                <Word
                  admin={admin}
                  uniqueId={uniqueId}
                  currentTeamMove={currentTeamMove}
                  users={users}
                  roundScore={roundScore}
                  isRoundEnded={isRoundEnded}
                  key={item.id}
                  word={item.word}
                  score={item.score}
                  id={item.id}
                />
              ))}
          </div>
        </div>
      )}

      <div className="ultraWrapper">
        <div className="fieldWrapper">
          <PlayField
            client={client}
            uniqueId={uniqueId}
            lightTheme={lightTheme}
            roundScore={roundScore}
            entryPointScore={entryPointScore}
            setRoundWords={setRoundWords}
            currentTeamLeader={currentTeamLeader}
            calculateCurrentMove={calculateCurrentMove}
            nextMove={nextMove}
            teamCount={teamCount - 1}
            isRoundEnded={isRoundEnded}
            moverLimit={moverLimit}
            lastWord={lastWord}
            isRoundStarted={isRoundStarted}
            timeLeft={timeLeft}
            currentTeamMove={currentTeamMove}
            isTeamReady={isTeamReady}
            admin={admin}
            users={users}
            isGameStarted={isGameStarted}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
