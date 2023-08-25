import React from 'react'
import { updateDoc, doc, collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
const Word = ({
  client,
  word,
  score,
  id,
  isRoundEnded,
  admin,
  uniqueId,
  i,
  roundWords,
}) => {
  const [isLast, setIsLast] = useState(false)
  useEffect(() => {
    if (roundWords?.length > 0) {
      if (roundWords.length - 1 === i) {
        setIsLast(true)
      } else setIsLast(false)
    }
  }, [roundWords, i])
  const params = useParams()
  const updateCount = async (handler) => {
    if (handler === 'minus' && score !== -1) {
      const adminRef = doc(db, `usersId=${params.id}`, admin.id)
      const nestedCollectionRef = collection(
        adminRef,
        `roundWordsId=${uniqueId}`
      )
      const wordRef = doc(nestedCollectionRef, id)
      await updateDoc(wordRef, {
        score: score - 1,
      })
      await addDoc(collection(adminRef, 'roundLogs'), {
        id: client.id,
        action: 'minus',
        created: Date.now(),
        name: client.userName,
        img: client.avatar,
        word,
      })
    } else if (handler === 'plus' && score !== 1) {
      const adminRef = doc(db, `usersId=${params.id}`, admin.id)
      const nestedCollectionRef = collection(
        adminRef,
        `roundWordsId=${uniqueId}`
      )
      const wordRef = doc(nestedCollectionRef, id)
      await updateDoc(wordRef, {
        score: score + 1,
      })
      await addDoc(collection(adminRef, 'roundLogs'), {
        id: client.id,
        action: 'plus',
        created: Date.now(),
        name: client.userName,
        img: client.avatar,
        word,
      })
    }
  }

  return (
    <div className={`wordItem ${isLast ? 'primary' : ''}`}>
      <div>{word}</div>
      {isRoundEnded && (
        <div className="wordItemCount">
          <div>
            <button onClick={() => updateCount('minus')} className="minus">
              <img
                src="https://cdn-icons-png.flaticon.com/128/10337/10337430.png"
                alt=""
              />
            </button>
          </div>
          <div>{score}</div>
          <div>
            <button onClick={() => updateCount('plus')}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/10337/10337471.png"
                alt=""
              />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Word
