import React from 'react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../redux/Slices/userSlice'
import { useParams } from 'react-router-dom'
import { addDoc, collection } from 'firebase/firestore'
import { avatars } from '../avatars'
import Avatar from './Avatar'

import { db } from '../firebase'
import { useRef } from 'react'

const Modal = ({ setShowModal, avatarIndex, setAvatarIndex, client }) => {
  const inputRef = useRef()
  const params = useParams()
  const localId = Math.round(Date.now() + Math.random() * 10000)
  const dispatch = useDispatch()

  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const onChangeInput = (e) => {
    setInputValue(e.target.value)
  }
  const createUser = async (event) => {
    event.preventDefault()
    if (inputValue.trim() == '' || inputValue.length > 16) {
      alert('Username should be more than 1 and less than 17 symbols')
      return
    } else {
      dispatch(setCurrentUser([inputValue, localId, avatars[avatarIndex]]))
      await addDoc(collection(db, `usersId=${params.id}`), {
        userName: inputValue,
        isAdmin: false,
        team: 0,
        isReady: false,
        teamScore: 0,
        entryPointScore: 0,
        nextMove: 0,
        localId: localId,
        avatar: avatars[avatarIndex],
      })

      setInputValue('')
      setShowModal(false)
    }
  }
  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      createUser(e)
    }
  }
  return (
    <div className="modalWrapper">
      <div className="modal">
        <div className="enterName">Enter your name</div>
        <div className="nameInput">
          <input
            ref={inputRef}
            onKeyDown={(e) => handleKeyPress(e)}
            onChange={(e) => onChangeInput(e)}
            value={inputValue}
            type="text"
            placeholder="Name"
          />
        </div>
        <div className="modalAvatarContainer">
          {avatars.map((image, i) => (
            <Avatar
              key={image}
              client={client}
              params={params}
              img={image}
              i={i}
              avatarIndex={avatarIndex}
              setAvatarIndex={setAvatarIndex}
            />
          ))}
        </div>

        <div className="continue">
          <button onClick={(e) => createUser(e)}>Continue</button>
        </div>
      </div>
    </div>
  )
}

export default Modal
